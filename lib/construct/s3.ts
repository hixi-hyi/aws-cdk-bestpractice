import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as s3 from '@aws-cdk/aws-s3';
import * as helper from 'lib/helper';
import * as construct from 'lib/construct';

interface S3BucketProps {
  bucketPrefix?: string;
  noEncryption?: boolean;
}

export class S3PrivateBucket extends cdk.Construct {
  public readonly bucket: s3.Bucket;
  public readonly encryptionKey: construct.KmsKey;
  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: S3BucketProps) {
    super(scope, id.constructName);
    const prefix = props.bucketPrefix ?? id.parent.dashName;
    const bucketName = helper.Naming.S3BucketName(id, prefix);
    if (!props.noEncryption) {
      this.encryptionKey = new construct.KmsKey(this, id.child("EncryptionKey"));
    }
    this.bucket = new s3.Bucket(this, 'Bucket', {
      encryptionKey: this.encryptionKey?.key,
      bucketName: bucketName,
      removalPolicy: helper.Aws.S3BucketRemovalPolicy(id),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}

