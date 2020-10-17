import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import route53 = require('@aws-cdk/aws-route53');

interface Route53HostedZoneProps {
  zoneName: string;
}

export class Route53HostedZone extends cdk.Construct {
  public readonly hostedZone: route53.HostedZone;
  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: Route53HostedZoneProps) {
    super(scope, id.constructName);
    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.zoneName,
    });
  }
}

