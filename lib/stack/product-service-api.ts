import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as construct from 'lib/construct';
import * as stack from 'lib/stack';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as path from 'path';

interface ProductServiceApiProps extends cdk.StackProps {
  common: stack.ProductCommon;
  dns: stack.AccountServiceDomain;
}

export class ProductServiceApi extends cdk.Stack {
  constructor(app: cdk.App, id: cdkid.Identifier, props: ProductServiceApiProps) {
    super(app, id.stackName);
    // COMMENTED: 本当は Github と連携してとかやるけども、今回はサンプルなのでこんな感じに
    const ecr = new construct.EcrAssets(this, id.child('Repository'), {
      assetsDirecroty: path.join(__dirname, 'product-service-api', 'docker', 'helloworld'),
    });
    const logs = new construct.Logs(this, id.child("Logs"));
    const fargate = new construct.FargateL7Webapp(this, id.child('Webapp'), {
      vpc: props.common.network.vpc,
      logs: {
        group: logs.group,
      },
      facing: {
        domainName: 'api',
        domainZone: props.dns.hixi.hostedZone,
      },
      task: {
        image: ecs.ContainerImage.fromEcrRepository(ecr.repository),
      },
      auroraUser: props.common.aurora.masterSecret,
    });
    { // additional policy
      if (id.rank.section == "dev") {
        // COMMENTED: 開発環境では開発時にいろんな Policy が必要なことがあるので、自由に編集していい Policy を作っておく
        const developmentPolicy = new iam.ManagedPolicy(this, "DevelopmentPolicy", {
          managedPolicyName: `${id.camelName}DevelopmentPolicy`,
          statements: [new iam.PolicyStatement({
            actions: ["own:dummy"],
            resources: ['*'],
          })],
        });
        fargate.service.taskDefinition.taskRole.addManagedPolicy(developmentPolicy);
      }
    }
  }
}

