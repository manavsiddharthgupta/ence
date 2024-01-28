import { sqsConsumerConfig } from '@/config/worker'
import { SqsConsumer } from '@/sqs/resources/sqsConsumer'
import { SQSProcessor } from '@/sqs/resources/sqsProcessor'

export async function GET() {
  const sqsConsumer = new SqsConsumer({
    name: 'worker',
    ...sqsConsumerConfig,
    handleMessage: SQSProcessor.handleMessage
  })
  console.log('SQS CONSUMER started')
  sqsConsumer.start().catch((error) => {
    console.error('Failed to start Consumer', error)
  })
}
