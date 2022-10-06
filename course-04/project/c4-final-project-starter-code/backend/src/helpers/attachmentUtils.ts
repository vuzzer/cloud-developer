import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger} from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS);

// TODO: Implement the fileStogare logic
export const attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const signedUrlExpiration = +process.env.SIGNED_URL_EXPIRATION;

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

const logger = createLogger('attachmentUtils');

export function getUploadUrl(imageId: string) {
  logger.debug('getUploadUrl imageId:', imageId);

  return s3.getSignedUrl('putObject', {
    Bucket: attachmentS3Bucket,
    Key: imageId,
    Expires: signedUrlExpiration
  });
}