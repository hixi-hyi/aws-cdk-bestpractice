import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as route53 from '@aws-cdk/aws-route53';
import * as certmgr from '@aws-cdk/aws-certificatemanager';
import * as cloudfrontOrigins from '@aws-cdk/aws-cloudfront-origins';
import * as construct from 'lib/construct';

interface StaticWebappPatternsProps extends cdk.StackProps {
  domainName: string;
  certificate?: certmgr.ICertificate;
  hostedZone: route53.IHostedZone;
}

export class StaticWebappPatterns extends cdk.Construct {
  public readonly origin: construct.S3PrivateBucket;
  public readonly distribution: construct.CloudFrontDistribution;
  constructor(app: cdk.Construct, id: cdkid.Identifier, props: StaticWebappPatternsProps) {
    super(app, id.constructName);
    this.origin = new construct.S3PrivateBucket(this, id.child("Origin"), {
      noEncryption: true,
    });
    this.distribution = new construct.CloudFrontDistribution(this, id.child("Frontend"), {
      origin: new cloudfrontOrigins.S3Origin(this.origin.bucket),
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      certificate: props.certificate,
    });
  }
}
