import { EventEmitter } from 'node:events'
import { suite, test, type TestContext } from 'node:test'
import { toWebSocketStream } from './to-websocket-stream.ts'

suite(toWebSocketStream.name, () => {
  test('creates websocket stream from websocket', async (t: TestContext) => {
    const ws = new EventEmitter()
    const wsStream = toWebSocketStream(ws as unknown as WebSocket)

    function emit() {
      ws.emit('message', { data: 'hello' } as MessageEvent)
      ws.emit('message', { data: 'from' } as MessageEvent)
      ws.emit('message', { data: 'server' } as MessageEvent)
      ws.emit('close')
    }

    const [actual] = await Promise.all([Array.fromAsync(wsStream), emit()])

    t.assert.deepStrictEqual(actual, ['hello', 'from', 'server'])
  })
})
