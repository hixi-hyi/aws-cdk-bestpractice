import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecrAssets from '@aws-cdk/aws-ecr-assets';

interface EcrAssetsProps {
  repositoryName?: string;
  assetsDirecroty: string;
}

export class EcrAssets extends cdk.Construct {
  public readonly repository: ecr.IRepository;

  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: EcrAssetsProps) {
    super(scope, id.constructName);
    const repositoryName = props.repositoryName ?? id.parent.slashName;
    const assets = new ecrAssets.DockerImageAsset(this, "AssetRepository", {
      repositoryName: repositoryName,
      directory: props.assetsDirecroty,
    });
    this.repository = assets.repository;
  }
}


