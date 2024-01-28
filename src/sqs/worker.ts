// import { sqsConsumerConfig } from '@/config/worker'
// import { SQSProcessor } from '@/sqs/resources/sqsProcessor'
// import { Consumer } from 'sqs-consumer'
// import { SQS } from 'aws-sdk'

import { sqsConsumerConfig } from '@/config/worker'
import { SqsConsumer } from './resources/sqsConsumer'

const workerQueueConsumer = new SqsConsumer({ ...sqsConsumerConfig })

export class WorkerQueue {
  static async reciever(value: any) {
    console.log('Job to be pulled to the SQS', value)
    try {
      const result = await workerQueueConsumer.sqs.receiveMessage().promise()

      console.log('Message pulled succesfully:', result)
      return result
    } catch (error) {
      console.error('Error pulling message:', error)
    }
  }
}
