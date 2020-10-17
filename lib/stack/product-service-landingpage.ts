import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as construct from 'lib/construct';
import * as stack from 'lib/stack';

interface ProductServiceLandingpageProps extends cdk.StackProps {
  dns: stack.AccountServiceDomain;
}

export class ProductServiceLandingpage extends cdk.Stack {
  constructor(app: cdk.App, id: cdkid.Identifier, props: ProductServiceLandingpageProps) {
    super(app, id.stackName, props);
    new construct.StaticWebappPatterns(this, id.child("Website"), {
      domainName: "www",
      hostedZone: props.dns.hixi.hostedZone,
    });
  }
}
