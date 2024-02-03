export const sqsConsumerConfig = {
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
