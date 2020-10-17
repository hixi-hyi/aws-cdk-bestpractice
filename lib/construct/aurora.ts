import * as cdk from '@aws-cdk/core';
import * as cdkid from 'aws-cdk-identifier';
import * as rds from 'lib/@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as construct from 'lib/construct';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as helper from 'lib/helper';

export interface AuroraMysqlProps {
  vpc: ec2.Vpc;
  numOfInstance: number;
  instanceType: ec2.InstanceType;
}

export class AuroraMysql extends cdk.Construct {
  public readonly cluster: rds.DatabaseCluster;
  public readonly encryptionKey: construct.KmsKey;
  public readonly masterSecret: secretsmanager.ISecret;

  constructor(scope: cdk.Construct, id: cdkid.Identifier, props: AuroraMysqlProps) {
    super(scope, id.constructName);
    const clusterPG = new rds.ParameterGroup(this, 'ClusterParameterGroup', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      parameters: {
        character_set_client: "utf8mb4",
        character_set_connection: "utf8mb4",
        character_set_database: "utf8mb4",
        character_set_filesystem: "utf8mb4",
        character_set_results: "utf8mb4",
        character_set_server: "utf8mb4",
        collation_connection: "utf8mb4_general_ci",
        collation_server: "utf8mb4_general_ci",
      },
    });
    this.encryptionKey = new construct.KmsKey(this, id.child("EncryptionKey"));
    const parameterGroup = new rds.ParameterGroup(this, "InstanceParameterGroup", {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      parameters: {
        "max_connections": "16000",
        "max_allowed_packet": "1073741824",
        "max_user_connections": "4294967295",
      }
    });
    this.cluster = new rds.DatabaseCluster(this, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        // COMMENTED: cdk で作るリソースはバージョンをすべて固定すべきです。
        // 固定しなかった場合(あとAutoUpdateが有効）とかだと、バージョンが上がったタイミングで cdk の管理から外れてしまいます。
        version: rds.AuroraMysqlEngineVersion.VER_2_07_2,
      }),
      masterUser: {
        username: 'admin',
      },
      instances: props.numOfInstance,
      instanceProps: {
        vpc: props.vpc,
        instanceType: props.instanceType,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE,
        },
        parameterGroup: parameterGroup,
      },
      parameterGroup: clusterPG,
      removalPolicy: helper.Aws.DatastoreRemovalPolicy(id),
      storageEncryptionKey: this.encryptionKey.key,
    });
    this.cluster.connections.allowDefaultPortFromAnyIpv4();
    this.masterSecret = this.cluster.secret!;
  }
}
