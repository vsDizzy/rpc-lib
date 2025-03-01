import { suite, test, type TestContext } from 'node:test'
import { createRpcTransport } from './rpc-transport.ts'

suite(createRpcTransport.name, async () => {
  const api = {
    test(x: number) {
      return x * x
    },
  }

  test('request method successfully', async (t: TestContext) => {
    const local = createRpcTransport()
    const remote = createRpcTransport(api)

    const req = async () => {
      try {
        return local.request('test', 4)
      } finally {
        await local.close()
      }
    }
    const pipeline = local.readable.pipeThrough(remote).pipeTo(local.writable)
    const [res] = await Promise.all([req(), pipeline])

    t.assert.strictEqual(res, 16)
  })

  test('request method that throws should fail', async (t: TestContext) => {
    const local = createRpcTransport()
    const remote = createRpcTransport({
      test(_x: number) {
        throw Error('error')
      },
    })

    const req = async () => {
      try {
        return local.request('test', 4)
      } finally {
        await local.close()
      }
    }
    const pipeline = local.readable.pipeThrough(remote).pipeTo(local.writable)

    await t.assert.rejects(() => Promise.all([req(), pipeline]), 'Error: error')
  })

  test('request nonexisting method should fail', async (t: TestContext) => {
    const local = createRpcTransport()
    const remote = createRpcTransport({})

    const req = async () => {
      try {
        return local.request('test', 4)
      } finally {
        await local.close()
      }
    }
    const pipeline = local.readable.pipeThrough(remote).pipeTo(local.writable)

    await t.assert.rejects(
      () => Promise.all([req(), pipeline]),
      /^Error: Method not found/
    )
  })
})
