import { ReadableStream } from 'node:stream/web'
import { suite, test, type TestContext } from 'node:test'
import {
  parseTransformStream,
  stringifyTransformStream,
} from './json-transform-streams.ts'

suite(parseTransformStream.name, () => {
  test('should parse JSON', async (t: TestContext) => {
    const input = JSON.stringify({ a: 1, b: [1, 2, 3], c: 'data', d: null })
    const expected = { a: 1, b: [1, 2, 3], c: 'data', d: null }

    const [actual] = await Array.fromAsync(
      ReadableStream.from([input]).pipeThrough(parseTransformStream())
    )

    t.assert.deepStrictEqual(actual, expected)
  })
})

suite(stringifyTransformStream.name, () => {
  test('should stringify JSON', async (t: TestContext) => {
    const input = { a: 1, b: [1, 2, 3], c: 'data', d: null }
    const expected = JSON.stringify({ a: 1, b: [1, 2, 3], c: 'data', d: null })

    const [actual] = await Array.fromAsync(
      ReadableStream.from([input]).pipeThrough(stringifyTransformStream())
    )

    t.assert.deepStrictEqual(actual, expected)
  })
})
