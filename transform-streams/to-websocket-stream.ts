import { on } from 'node:events'
import { ReadableStream } from 'node:stream/web'
import { toTransformStream } from './to-transform-stream.ts'

async function* webSocketMessagesGen(
  messageEvents: AsyncIterable<MessageEvent[]>
) {
  for await (const [msg] of messageEvents) {
    yield msg.data as string
  }
}

export function toWebSocketStream(ws: WebSocket) {
  const messageStream = ReadableStream.from(
    on(ws, 'message', {
      close: ['close'],
    }) as NodeJS.AsyncIterator<MessageEvent[]>
  )

  return messageStream.pipeThrough(toTransformStream(webSocketMessagesGen))
}
