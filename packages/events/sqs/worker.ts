import { SqsProducer } from './sqsProducer'
import { sqsConsumerConfig } from '../config'

const workerQueueProducer = new SqsProducer({ ...sqsConsumerConfig })

export class WorkerQueue {
  static async push(value: any) {
    console.log('Job to be pushed to the SQS', value)
    try {
      const result = await workerQueueProducer.sqs
        .sendMessage({
          QueueUrl: workerQueueProducer.queueUrl,
          MessageBody: JSON.stringify(value),
          MessageGroupId: String(value.data.invoiceId)
        })
        .promise()

      console.log('Message sent successfully:', result)
      return result
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}
