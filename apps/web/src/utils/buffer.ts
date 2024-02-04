export async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const chunks = []
  const reader = stream.getReader()
  while (true) {
    const { value, done } = await reader.read()
    if (value) chunks.push(value)
    if (done) break
  }
  return Buffer.concat(chunks)
}
