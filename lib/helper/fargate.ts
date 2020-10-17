import * as cdkid from 'aws-cdk-identifier';
import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';

interface Environment {
  [key:string]: string;
};
interface Secrets {
  [key:string]: ecs.Secret;
}

export function IacEnvironment(id: cdkid.Identifier): Environment {
  return {
    'IAC_CORE_SECTION': id.rank.section,
    'IAC_CORE_LEGION': id.rank.legion,
    'IAC_CORE_FAMILY': id.rank.family,
  };
}

export function IacAuroraSecrets(secrets: secretsmanager.ISecret): Secrets {
  return {
    'IAC_AURORA': ecs.Secret.fromSecretsManager(secrets),
  };
}

