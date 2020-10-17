import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as construct from 'lib/construct';

interface ProductCommonProos extends cdk.StackProps { }

export class ProductCommon extends cdk.Stack {
  public readonly network: construct.Network;
  public readonly aurora: construct.AuroraMysql;

  constructor(app: cdk.App, id: cdkid.Identifier, props: ProductCommonProos) {
    super(app, id.stackName, props);
    this.network = new construct.Network(this, id.child("Network"), {
      cidr: cdkid.Variables.resolve(id, cdkid.RankLoc.Section, {
        dev: '10.0.0.0/16',
        prod: '10.1.0.0/16',
      }),
    });
    this.aurora = new construct.AuroraMysql(this, id.child("Aurora"), {
      vpc: this.network.vpc,
      numOfInstance: cdkid.Variables.resolve(id, cdkid.RankLoc.Section, {
        dev: 1,
        prod: 2,
      }),
      instanceType: cdkid.Variables.resolve(id, cdkid.RankLoc.Section, {
        dev: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
        prod: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.XLARGE),
      }),
    });
  }
}

