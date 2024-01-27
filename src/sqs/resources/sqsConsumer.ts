import AWS from 'aws-sdk'
import pTimeout, { TimeoutError } from 'p-timeout'
import autoBind from 'auto-bind'

function hasMessages(response: any) {
  return response.Messages && response.Messages.length > 0
}

const SQS = AWS.SQS

export class SqsConsumer {
  public name: string
  public region: string
  public sqs: any
  public queueUrl: string
  public batchSize: number
  public throttleLimit: number
  public waitTimeSeconds: number
  public visibilityTimeout: number
  public handleMessageTimeout: number
  public throttleValue: number
  public numberOfMessagesBeingProcessed: number
  public running: boolean
  public stopped: boolean
  public handleMessage: (message: any) => Promise<void>

  constructor(options: any) {
    this.name = options.name
    this.region = options.REGION
    this.sqs = new SQS({ region: this.region })
    this.queueUrl = options.URL
    this.batchSize = options.BATCH_SIZE
    this.throttleLimit = options.THROTTLE_LIMIT
    this.waitTimeSeconds = options.WAIT_TIME_SECONDS
    this.visibilityTimeout = options.VISIBILITY_TIMEOUT
    this.handleMessageTimeout = options.MESSAGE_TIMEOUT
    this.throttleValue = 0
    this.numberOfMessagesBeingProcessed = 0
    this.running = false
    this.stopped = false
    this.handleMessage = options.handleMessage

    autoBind(this)
  }

  status(): Record<string, any> {
    return {
      running: this.running,
      stopped: this.stopped,
      url: this.queueUrl,
      batchsize: this.batchSize,
      throttlelimit: this.throttleLimit
    }
  }

  start = async (): Promise<Record<string, any>> => {
    if (this.running === true) {
      throw new Error('Already running')
    }
    this.running = true
    this.stopped = false
    this.throttleValue = this.throttleLimit / this.batchSize
    for (let i = 0; i < this.throttleValue; i++) {
      setTimeout(() => {
        this.poll().catch((error) => {
          console.log(error)
        })
      }, i * 1000)
    }
    console.log(`Started ${this.name} consumer`)
    return this.status()
  }

  stop = async (): Promise<Record<string, any>> => {
    this.stopped = true
    while (this.numberOfMessagesBeingProcessed > 0);
    this.running = false
    console.info('sqs consumer stopped')
    return this.status()
  }

  poll = async (): Promise<void> => {
    if (this.stopped) {
      return
    }
    try {
      const response = await this.receiveMessage()
      const processedMessages = await this.handleSqsResponse(response)
      await this.deleteProcessedMessages(processedMessages)
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.poll().catch((error) => {
          console.error(error)
        })
      }, 0)
    }
  }

  receiveMessage = async (): Promise<any> => {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: this.batchSize,
      WaitTimeSeconds: this.waitTimeSeconds,
      VisibilityTimeout: this.visibilityTimeout
    }
    return this.sqs.receiveMessage(params)
  }

  handleSqsResponse = async (response: any): Promise<void[]> => {
    if (response) {
      if (hasMessages(response)) {
        return Promise.all(response.Messages.map(this.processMessage))
      }
    }
    return []
  }

  processMessage = async (message: any): Promise<void> => {
    try {
      this.numberOfMessagesBeingProcessed++
      await this.executeHandler(message)
    } catch (error) {
      console.error(error)
    } finally {
      this.numberOfMessagesBeingProcessed--
    }
  }

  executeHandler = async (message: any): Promise<void> => {
    try {
      await pTimeout(this.handleMessage(message), {
        milliseconds: this.handleMessageTimeout
      })
    } catch (error) {
      if (error instanceof TimeoutError) {
        const timeoutError = error as TimeoutError
        timeoutError.message = `Message handler timed out after ${this.handleMessageTimeout}ms: Operation timed out.`
      } else {
        const otherError = error as Error
        otherError.message = `Unexpected message handler failure: ${otherError.message}`
      }
      console.error(`[SQS Consumer]: Message: ${JSON.stringify(message)}`)
      throw error
    }
  }

  deleteMessage = async (message: any): Promise<any> => {
    const params = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }
    return this.sqs.deleteMessage(params)
  }

  deleteProcessedMessages = async (processedMessages: any): Promise<any> => {
    if (!processedMessages) {
      return
    }
    const messagesToDelete = processedMessages.filter(
      (_message: any) => !!_message
    )
    if (messagesToDelete.length < 1) {
      return
    }
    const entries = messagesToDelete.map((item: any, index: number) => {
      return { Id: String(index), ReceiptHandle: item.ReceiptHandle }
    })
    return this.sqs.deleteMessageBatch({
      QueueUrl: this.queueUrl,
      Entries: entries
    })
  }
}
