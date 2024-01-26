interface SqsConsumerConfig {
  REGION: string
  URL: string
  BATCH_SIZE: number
  THROTTLE_LIMIT: number
  VISIBILITY_TIMEOUT: number
  MESSAGE_TIMEOUT: number
  WAIT_TIME_SECONDS: number
  ACCESS_KEY_ID: string
  SECRET_ACCESS_KEY: string
}

export const sqsConsumerConfig: SqsConsumerConfig = {
  REGION: 'us-east-1',
  URL: process.env.SQS_WORKER_QUEUE_URL ?? '',
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  BATCH_SIZE: 2,
  THROTTLE_LIMIT: 5,
  VISIBILITY_TIMEOUT: 30,
  MESSAGE_TIMEOUT: 60,
  WAIT_TIME_SECONDS: 1
}
