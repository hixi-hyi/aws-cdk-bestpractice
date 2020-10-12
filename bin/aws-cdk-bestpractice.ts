#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkBestpracticeStack } from '../lib/aws-cdk-bestpractice-stack';

const app = new cdk.App();
new AwsCdkBestpracticeStack(app, 'AwsCdkBestpracticeStack');
