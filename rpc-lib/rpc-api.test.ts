import { suite, test, type TestContext } from 'node:test'
import { createRpcApi } from './rpc-api.ts'

suite(createRpcApi.name, () => {
  const api = {
    test(x: number) {
      return x * x
    },
  }

  test('api request', async (t: TestContext) => {
    const local = createRpcApi<typeof api>()
    const remote = createRpcApi(api)

    const req = async () => {
      try {
        return local.request.test(4)
      } finally {
        await local.close()
      }
    }
    const pipeline = local.readable.pipeThrough(remote).pipeTo(local.writable)
    const [res] = await Promise.all([req(), pipeline])

    t.assert.strictEqual(res, 16)
  })

  test('api notification', async (t: TestContext) => {
    const local = createRpcApi<typeof api>()
    const remote = createRpcApi(api)

    const req = async () => {
      try {
        return local.notification.test(4)
      } finally {
        await local.close()
      }
    }
    const pipeline = local.readable.pipeThrough(remote).pipeTo(local.writable)
    const [res] = await Promise.all([req(), pipeline])

    t.assert.strictEqual(res, undefined)
  })
})
