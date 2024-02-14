import { Client } from '@upstash/qstash'

const q = new Client({
  token: process.env.QSTASH_TOKEN!,
  retry: false // will change later
})

const url =
  process.env.QSTASH_URL! +
  process.env.NEXT_PUBLIC_API_URL! +
  '/api/events/invoice'
export class WorkerQueue {
  static async push(value: any) {
    console.log('Job to be pushed to the Q_STASH', value)
    try {
      const result = await q.publish({
        url: url,
        body: JSON.stringify(value)
      })

      console.log('Message sent successfully:', result)
      return result
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}
