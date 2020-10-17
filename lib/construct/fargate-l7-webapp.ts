import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as logs from '@aws-cdk/aws-logs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as route53 from '@aws-cdk/aws-route53';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as helper from 'lib/helper';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as iam from '@aws-cdk/aws-iam';

interface FargateL7WebappProps {
  vpc: ec2.Vpc;
  logs: {
    group: logs.LogGroup;
    streamPrefix?: string;
  };
  taskSize?: {
    cpu?: number;
    memory?: number;
  };
  facing: {
    domainName: string;
    domainZone: route53.HostedZone;
    certificate?: acm.Certificate;
  };
  task: {
    containerPort?: number;
    environment?: { [key:string]: string };
    secrets?: { [key:string]: ecs.Secret };
    image: ecs.ContainerImage;
  };
  auroraUser: secretsmanager.ISecret;
}

export class FargateL7Webapp extends cdk.Construct {
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.FargateService;
  public readonly patterns: ecsPatterns.ApplicationLoadBalancedFargateService;
  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: FargateL7WebappProps) {
    super(scope, id.constructName);

    this.cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: id.camelName,
      containerInsights: true,
      vpc: props.vpc,
    });
    const logDriver = new ecs.AwsLogDriver({
      logGroup: props.logs.group,
      streamPrefix: props.logs.streamPrefix || 'webapp',
    });
    this.patterns = new ecsPatterns.ApplicationLoadBalancedFargateService(this, "Service", {
      cluster: this.cluster,
      serviceName: id.camelName,
      cpu: props.taskSize?.cpu ?? undefined,
      memoryLimitMiB: props.taskSize?.memory ?? undefined,
      publicLoadBalancer: true,
      domainName: props.facing.domainName,
      domainZone: props.facing.domainZone,
      certificate: props.facing.certificate ?? undefined,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      taskImageOptions: {
        enableLogging: true,
        logDriver: logDriver,
        containerName: 'WebappContainer',
        containerPort: props.task.containerPort ?? 8000,
        image: props.task.image,
        environment: {
          ...helper.Fargate.IacEnvironment(id),
          ...props.task.environment,
        },
        secrets: {
          ...props.task.secrets,
          ...helper.Fargate.IacAuroraSecrets(props.auroraUser),
        }
      },
    });
    this.service = this.patterns.service;
    this.patterns.targetGroup.configureHealthCheck({
      path: '/health',
      unhealthyThresholdCount: 5,
    });

    // COMMENTED: 開発者用の ssm parameter への権限の付与
    this.patterns.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      resources: [`arn:aws:ssm:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:parameter/${id.parent.slashName}/app/*`],
      actions: [
        'ssm:GetParameters',
        'ssm:GetParameter',
        'ssm:DescribeParameters',
      ],
    }));
  }
}
