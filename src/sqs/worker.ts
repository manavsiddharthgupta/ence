// import { sqsConsumerConfig } from '@/config/worker'
// import { SQSProcessor } from '@/sqs/resources/sqsProcessor'
// import { Consumer } from 'sqs-consumer'
// import { SQS } from 'aws-sdk'
import { SQSEvent, Context, SQSHandler, SQSRecord } from 'aws-lambda'
// import { SQSProcessor } from './resources/sqsProcessor'

// import { sqsConsumerConfig } from '@/config/worker'
// import { SqsConsumer } from './resources/sqsConsumer'

// const workerQueueConsumer = new SqsConsumer({ ...sqsConsumerConfig })

// export class WorkerQueue {
//   static async reciever(value: any) {
//     console.log('Job to be pulled to the SQS', value)
//     try {
//       const result = await workerQueueConsumer.sqs.receiveMessage().promise()

//       console.log('Message pulled succesfully:', result)
//       return result
//     } catch (error) {
//       console.error('Error pulling message:', error)
//     }
//   }
// }

export const receiver: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  for (const message of event.Records) {
    await processMessageAsync(message)
  }
  console.info('done')
}

async function processMessageAsync(message: SQSRecord): Promise<any> {
  try {
    console.log(`Processed message ${message.body}`)
    // TODO: Do interesting work based on the new message
    // await SQSProcessor.handleMessage(message)
  } catch (err) {
    console.error('An error occurred')
    throw err
  }
}
