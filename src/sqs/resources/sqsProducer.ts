import { SQS } from 'aws-sdk'
import autoBind from 'auto-bind'

export class SqsProducer {
  public region: string
  public sqs: SQS
  public queueUrl: string

  constructor(options: any) {
    this.region = options.REGION
    this.sqs = new SQS({ region: this.region })
    this.queueUrl = options.URL

    autoBind(this)
  }
}
