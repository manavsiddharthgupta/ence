import { SQSEvent, Context, SQSHandler, SQSRecord } from 'aws-lambda'
import { SQSProcessor } from './sqs/sqsProcessor.js'

export const handler: SQSHandler = async (
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
    await SQSProcessor.handleMessage(message)
  } catch (err) {
    console.error('An error occurred')
    throw err
  }
}
