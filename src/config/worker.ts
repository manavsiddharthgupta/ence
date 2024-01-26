interface SqsConsumerConfig {
  REGION: string
  URL: string
  BATCH_SIZE: number
  THROTTLE_LIMIT: number
  VISIBILITY_TIMEOUT: number
  MESSAGE_TIMEOUT: number
  WAIT_TIME_SECONDS: number
}

export const sqsConsumerConfig: SqsConsumerConfig = {
  REGION: 'us-east-1',
  URL: process.env.WORKER_QUEUE_URL ?? '',
  BATCH_SIZE: 2,
  THROTTLE_LIMIT: 5,
  VISIBILITY_TIMEOUT: 30,
  MESSAGE_TIMEOUT: 60,
  WAIT_TIME_SECONDS: 1
}
