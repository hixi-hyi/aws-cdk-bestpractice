import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as logs from '@aws-cdk/aws-logs';
import * as helper from 'lib/helper';


export interface LogsProps {
  groupName?: string;
  retention?: logs.RetentionDays;
  removalPolicy?: cdk.RemovalPolicy;
}

export class Logs extends cdk.Construct {
  public readonly group: logs.LogGroup;
  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: LogsProps = {}) {
    super(scope, id.constructName);
    this.group = new logs.LogGroup(this, 'Group', {
      logGroupName: props.groupName || '/' + id.parent.slashName,
      retention: props.retention || helper.Aws.LogGroupRetentionDay(id),
      removalPolicy: props.removalPolicy || helper.Aws.LogGroupRemovalPolicy(id),
    });

  }
}

