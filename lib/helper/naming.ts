import * as cdkid from 'aws-cdk-identifier';

export function S3BucketNameSuffix(id: cdkid.Identifier) {
  return cdkid.Variables.resolve<string>(id, cdkid.RankLoc.Section, {
    dev: 'dt-dev-dt-hixi-dt-jp',
    prod: 'dt-hixi-dt-jp',
  });
}

export function S3BucketName(id: cdkid.Identifier, prefix: string) {
  const suffix = S3BucketNameSuffix(id);
  return `${prefix}-${suffix}`;
}

