import { ReadableStream, TransformStream } from 'node:stream/web'

export function toTransformStream<I, O>(
  transformer: (src: AsyncIterable<I>) => AsyncIterable<O>
) {
  const { writable, readable } = new TransformStream<I, I>()

  return { writable, readable: ReadableStream.from(transformer(readable)) }
}
