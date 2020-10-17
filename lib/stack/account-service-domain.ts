import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as construct from 'lib/construct';


export class AccountServiceDomain extends cdk.Stack {
  public readonly hixi: construct.Route53HostedZone;
  constructor(app: cdk.App, id: cdkid.Identifier) {
    super(app, id.stackName);
    this.hixi = new construct.Route53HostedZone(this, id.child("Hixi"), {
      zoneName: cdkid.Variables.resolve(id, cdkid.RankLoc.Section, {
        dev: 'dev.hixi.jp',
        prod: 'hixi.jp',
      }),
    });
  }
}

