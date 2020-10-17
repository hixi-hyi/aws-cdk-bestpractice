import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as kms from '@aws-cdk/aws-kms';
import * as helper from 'lib/helper';

export class KmsKey extends cdk.Construct {
  public readonly key: kms.Key;
  constructor(scope: cdk.Construct, id: cdkid.Identifier) {
    super(scope, id.constructName);
    this.key = new kms.Key(this, 'EncryptKey', {
      description: `${id.camelName}`,
      removalPolicy: helper.Aws.KmsRemovalPolicy(id),
    });
    // COMMENTED: Administorator に KMS の権限を渡しています。
    // Administorator を普段から多くの人に与える場合は、Administorator よりも上位の Role を作っておいて、その Role に権限を与えるとかもいいかもしれません
    this.key.grantDecrypt(helper.Aws.IamAdministoratorIGrantable(this, id));
  }
}
