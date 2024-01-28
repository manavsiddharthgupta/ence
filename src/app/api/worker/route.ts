import { sqsConsumerConfig } from '@/config/worker'
import { SqsConsumer } from '@/sqs/resources/sqsConsumer'
import { SQSProcessor } from '@/sqs/resources/sqsProcessor'

export const runtime = 'nodejs'

export async function GET() {
  const sqsConsumer = new SqsConsumer({
    name: 'worker',
    ...sqsConsumerConfig,
    handleMessage: SQSProcessor.handleMessage
  })
  console.log('SQS CONSUMER started')
  sqsConsumer.start().catch((error) => {
    console.error('Failed to start Consumer', error)
    return new Response('Not found', { status: 404 })
  })
  return new Response('Success', { status: 200 })
}
