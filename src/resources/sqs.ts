import AWS from 'aws-sdk'

const sqs = new AWS.SQS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
  apiVersion: '2012-11-05'
})

export async function sendMessageToSQS(messageBody: string): Promise<string> {
  const params: any = {
    MessageBody: messageBody,
    QueueUrl: process.env.SQS_URL
  }

  const data = await sqs.sendMessage(params).promise()
  const messageId: any = data.MessageId
  return messageId
}

export async function receiveMessageFromSQS(): Promise<string | null> {
  const params: any = {
    QueueUrl: process.env.SQS_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20
  }

  const data: any = await sqs.receiveMessage(params).promise()

  return data.Messages[0].Body
}
