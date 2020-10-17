#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as stack from 'lib/stack';

function resolveEnvironmentFromAwsAccountId(): string {
  const sections = new Map<string, string>([
    ['${YOUR_DEV_AWS_ACCOUNT_ID}', 'dev'],
    ['${YOUR_PROD_AWS_ACCOUNT_ID}', 'prod'],
  ]);
  const account = process.env.CDK_DEFAULT_ACCOUNT || '';
  const section = sections.get(account);
  if (section !== undefined) {
    return section
  }
  throw new Error('Error: account not found')
}
const id = new cdkid.Identifier({
  empire: "hixi",
  division: "projectname",
  section: resolveEnvironmentFromAwsAccountId(),
});
// COMMENTED: 今回 AWS Account を Dev, Prod と分けています。
// START_LOC を SECTION よりも下にすることで StackName が AccountServiceDomain のようになります
// START_LOC を SECTION にすることで StackName が DevAccountServiceDomain のようになるので、どのレベルでアカウントを分けるかでここに値を調整できればと思っています
cdkid.Rank.DEFAULT_START_LOC = cdkid.RankLoc.Legion

let dns: stack.AccountServiceDomain;

const app = new cdk.App();
id.child({legion: "account"}).scope((id: cdkid.Identifier) => {
  id.child({cohort: "service"}).scope((id: cdkid.Identifier) => {
    dns = new stack.AccountServiceDomain(app, id.child({family: "domain"}));
  });
});
id.child({legion: "product"}).scope((id: cdkid.Identifier) => {
  const common = new stack.ProductCommon(app, id.child({cohort: "common"}), {});
  id.child({cohort: "service"}).scope((id: cdkid.Identifier) => {
    new stack.ProductServiceLandingpage(app, id.child({family: 'landingpage'}), { dns });
    new stack.ProductServiceApi(app, id.child({family: 'api'}), { common, dns });
  });
});

