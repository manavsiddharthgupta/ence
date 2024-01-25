import { sqsConsumerConfig } from './config/worker'
import { SqsConsumer } from './resources/sqsConsumer'
import { SQSProcessor } from './sqsProcessor'

export const sqsConsumer = new SqsConsumer({
  name: 'worker',
  ...sqsConsumerConfig,
  handleMessage: SQSProcessor.handleMessage
})

sqsConsumer.start().catch(error => {
  console.error('Failed to start Consumer', error)
})
