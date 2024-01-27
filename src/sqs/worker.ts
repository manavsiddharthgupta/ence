import { sqsConsumerConfig } from '../config/worker'
import { SqsConsumer } from './resources/sqsConsumer'
import { SQSProcessor } from './resources/sqsProcessor'

export const sqsConsumer = new SqsConsumer({
  name: 'worker',
  ...sqsConsumerConfig,
  handleMessage: SQSProcessor.handleMessage
})
console.log('SQS CONSUMER started')
sqsConsumer.start().catch((error) => {
  console.error('Failed to start Consumer', error)
})
