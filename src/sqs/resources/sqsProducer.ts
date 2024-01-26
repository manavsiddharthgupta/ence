import { SQS } from 'aws-sdk'
import autoBind from 'auto-bind'

export class SqsProducer {
  public region: string
  public sqs: SQS
  public queueUrl: string
  public credentials: { accessKeyId: string; secretAccessKey: string }

  constructor(options: any) {
    this.region = options.REGION
    this.credentials = {
      accessKeyId: options.ACCESS_KEY_ID,
      secretAccessKey: options.SECRET_ACCESS_KEY
    }

    this.sqs = new SQS({
      region: this.region,
      credentials: this.credentials
    })
    this.queueUrl = options.URL

    autoBind(this)
  }
}
