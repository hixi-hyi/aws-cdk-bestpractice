import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as logs from '@aws-cdk/aws-logs';
import * as iam from '@aws-cdk/aws-iam';

// 構築中は何度も作り直すので DESTROY にする
const DEV_DEFAULT_REMOVAL_POLICY = cdk.RemovalPolicy.DESTROY;
const PROD_DEFAULT_REMOVAL_POLICY = cdk.RemovalPolicy.RETAIN;

export function LogGroupRemovalPolicy(id: cdkid.Identifier): cdk.RemovalPolicy  {
  return cdkid.Variables.resolve<cdk.RemovalPolicy>(id, cdkid.RankLoc.Section, {
    dev: DEV_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
    prod: PROD_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
  })
}

export function EcrRemovalPolicy(id: cdkid.Identifier): cdk.RemovalPolicy {
  return cdkid.Variables.resolve<cdk.RemovalPolicy>(id, cdkid.RankLoc.Section, {
    dev: DEV_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
    prod: PROD_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
  })
}

export function LogGroupRetentionDay(id: cdkid.Identifier): logs.RetentionDays {
  return cdkid.Variables.resolve<logs.RetentionDays>(id, cdkid.RankLoc.Section, {
    dev: logs.RetentionDays.TWO_WEEKS,
    prod: logs.RetentionDays.INFINITE,
  })
}

export function LogGroupCfnLambdaRetentionDay(): logs.RetentionDays {
  return logs.RetentionDays.ONE_WEEK;
}

export function DatastoreRemovalPolicy(id: cdkid.Identifier): cdk.RemovalPolicy {
  return cdkid.Variables.resolve<cdk.RemovalPolicy>(id, cdkid.RankLoc.Section, {
    dev: DEV_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.SNAPSHOT,
    prod: PROD_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
  });
}

export function S3BucketRemovalPolicy(id: cdkid.Identifier): cdk.RemovalPolicy  {
  return cdkid.Variables.resolve<cdk.RemovalPolicy>(id, cdkid.RankLoc.Section, {
    dev: DEV_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
    prod: PROD_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
  })
}

export function KmsRemovalPolicy(id: cdkid.Identifier): cdk.RemovalPolicy {
  return cdkid.Variables.resolve<cdk.RemovalPolicy>(id, cdkid.RankLoc.Section, {
    dev: DEV_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
    prod: PROD_DEFAULT_REMOVAL_POLICY ?? cdk.RemovalPolicy.RETAIN,
  })
}

export function IamAdministoratorIGrantable(scope: cdk.Construct, id: cdkid.Identifier): iam.IGrantable {
  const arn: string = ((id) => {
    return cdkid.Variables.resolve<string>(id, cdkid.RankLoc.Section, {
      dev: "arn:aws:iam::xxxxx:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSAdministratorAdministoratorAccess_xxxxx",
      prod: "arn:aws:iam::xxxxx:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSAdministratorAdministoratorAccess_xxxxx",
    });
  })(id);

  return iam.Role.fromRoleArn(scope, "AdministoratorRole", arn, { mutable: false });
}

