import { Client } from '@upstash/qstash'

const q = new Client({
  token: process.env.QSTASH_TOKEN!,
  retry: {
    retries: 3
  }
})

export class WorkerQueue {
  static async push(value: any) {
    console.log('Job to be pushed to the Q_STASH', value)
    try {
      const result = await q.publish({
        url: process.env.NEXT_PUBLIC_API_URL! + '/api/events/invoice',
        body: JSON.stringify(value),
        headers: {
          Authorization: `Bearer ${process.env.QSTASH_TOKEN!}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Message sent successfully:', result)
      return result
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}
