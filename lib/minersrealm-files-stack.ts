import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Certificate} from "aws-cdk-lib/aws-certificatemanager";
import {Constants} from "./constants";
import {CloudFrontToS3} from "@aws-solutions-constructs/aws-cloudfront-s3";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";

const path = "./assets";

export class MinersRealmFilesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const certificate = Certificate.fromCertificateArn(this, `${Constants.appName}Certificate`, Constants.certificateArn);

    const cloudFrontToS3 = new CloudFrontToS3(this, Constants.appName, {
      cloudFrontDistributionProps: {
        certificate: certificate,
        domainNames: [ Constants.domainName ],
      }
    });

    if (cloudFrontToS3.s3Bucket !== undefined) {
      new BucketDeployment(this, `${Constants.appName}Deployment`, {
        sources: [ Source.asset(path) ],
        destinationBucket: cloudFrontToS3.s3Bucket,
      });
    }
  }
}
