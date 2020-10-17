import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as construct from 'lib/construct';
import * as ec2 from '@aws-cdk/aws-ec2';

export interface NetworkProps {
  numOfNatGateway?: number;
  numOfAz?: number;
  cidr: string;
}

export class Network extends cdk.Construct {
  public readonly vpc: ec2.Vpc;
  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: NetworkProps) {
    super(scope, id.constructName);
    const flowLog = new construct.Logs(this, id.child('Flowlogs'), {
      groupName: `/${id.slashName}/flowlogs`,
    });
    this.vpc = new ec2.Vpc(this, "Vpc", {
      cidr: props.cidr,
      natGateways: props.numOfNatGateway ?? 1,
      maxAzs: props.numOfAz ?? 1,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    this.vpc.addFlowLog('FlowLogS3', {
      destination: ec2.FlowLogDestination.toCloudWatchLogs(flowLog.group),
    })
    this.vpc.addInterfaceEndpoint('VpcEndpointEcrDocker', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
      privateDnsEnabled: true,
    });
    this.vpc.addInterfaceEndpoint('VpcEndpointCloudwatch', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH,
      privateDnsEnabled: true,
    });
    this.vpc.addGatewayEndpoint("VpcEndpointS3", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        { subnetType: ec2.SubnetType.PRIVATE }
      ],
    });
  }
}

