import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as certmgr from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';


interface CloudFrontDistributionProps {
  origin: cloudfront.IOrigin;
  domainName: string;
  hostedZone: route53.IHostedZone;
  certificate?: certmgr.ICertificate;
}

export class CloudFrontDistribution extends cdk.Construct {
  public readonly distribution: cloudfront.IDistribution;
  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: CloudFrontDistributionProps) {
    super(scope, id.constructName);
    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: props.origin,
      },
      domainNames: [props.domainName],
      certificate: props.certificate?? undefined,
      errorResponses: [
        { httpStatus: 403, ttl: cdk.Duration.seconds(10) },
        { httpStatus: 404, ttl: cdk.Duration.seconds(10) },
        { httpStatus: 500, ttl: cdk.Duration.seconds(0) },
        { httpStatus: 502, ttl: cdk.Duration.seconds(1) },
        { httpStatus: 503, ttl: cdk.Duration.seconds(1) },
        { httpStatus: 504, ttl: cdk.Duration.seconds(1) },
      ],
    });
    new route53.CnameRecord(this, "Cname", {
      zone: props.hostedZone,
      recordName: props.domainName,
      domainName: this.distribution.domainName,
    });
  }
}

