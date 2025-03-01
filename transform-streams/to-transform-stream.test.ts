import { ReadableStream } from 'node:stream/web'
import { suite, test, type TestContext } from 'node:test'
import { toTransformStream } from './to-transform-stream.ts'

suite(toTransformStream.name, () => {
  test('should transform async generator', async (t: TestContext) => {
    const input = [1, 2, 3, 4, 5]
    const expected = input.map((x) => x * 2)

    const transformStream = toTransformStream(async function* (
      src: AsyncIterable<number>
    ) {
      for await (const chunk of src) {
        yield chunk * 2
      }
    })

    const actual = await Array.fromAsync(
      ReadableStream.from(input).pipeThrough(transformStream)
    )

    t.assert.deepStrictEqual(actual, expected)
  })

  test('should handle generator error', async (t: TestContext) => {
    const input = [1, 2, 3, 4, 5]

    const transformStream = toTransformStream(async function* (
      src: AsyncIterable<number>
    ) {
      for await (const chunk of src) {
        yield chunk * 2
        throw new Error('failed')
      }
    })

    const actual = Array.fromAsync(
      ReadableStream.from(input).pipeThrough(transformStream)
    )
    await t.assert.rejects(() => actual, 'Error: failed')
  })
})
