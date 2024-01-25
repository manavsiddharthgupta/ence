import AWS from 'aws-sdk'

const SQS = AWS.SQS

export class SqsProducer {
  public region: string
  public sqs: any
  public queueUrl: string

  constructor(options: any) {
    this.region = options.REGION
    this.sqs = new SQS({ region: this.region })
    this.queueUrl = options.URL
  }
}
