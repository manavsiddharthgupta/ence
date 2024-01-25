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
  REGION: process.env.WORKER_QUEUE_REGION ?? '',
  URL: process.env.WORKER_QUEUE_URL ?? '',
  BATCH_SIZE: process.env.WORKER_QUEUE_BATCH_SIZE
    ? Number(process.env.WORKER_QUEUE_BATCH_SIZE)
    : 2,
  THROTTLE_LIMIT: process.env.WORKER_QUEUE_THROTTLE_LIMIT
    ? Number(process.env.WORKER_QUEUE_THROTTLE_LIMIT)
    : 5,
  VISIBILITY_TIMEOUT: process.env.WORKER_QUEUE_VISIBILITY_TIMEOUT
    ? Number(process.env.WORKER_QUEUE_VISIBILITY_TIMEOUT)
    : 30,
  MESSAGE_TIMEOUT: process.env.WORKER_QUEUE_MESSAGE_TIMEOUT
    ? Number(process.env.WORKER_QUEUE_MESSAGE_TIMEOUT)
    : 60,
  WAIT_TIME_SECONDS: process.env.WORKER_QUEUE_WAIT_TIME_SECONDS
    ? Number(process.env.WORKER_QUEUE_WAIT_TIME_SECONDS)
    : 1
}
