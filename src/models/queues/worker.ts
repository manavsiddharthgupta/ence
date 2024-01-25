import { SqsProducer } from '@/resources/sqsProducer'
import { sqsConsumerConfig } from '../../config/worker'

const workerQueueProducer = new SqsProducer({ ...sqsConsumerConfig })

export class WorkerQueue {
  static async push(value: any) {
    console.log('Job to be pushed to the sqs', value)
    return workerQueueProducer.sqs.sendMessage({
      QueueUrl: workerQueueProducer.queueUrl,
      MessageBody: JSON.stringify(value)
    })
  }
}
