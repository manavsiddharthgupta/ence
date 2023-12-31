import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: 'AKIAQEQAIVHNTM2A37DP',
  secretAccessKey: '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',
  region: 'us-east-1'
})

export async function uploadFilesToS3(
  bucket: string,
  key: string,
  body: any
): Promise<string> {
  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  }

  const data = await s3.upload(uploadParams).promise()
  const s3Url = data.Location
  return s3Url
}
