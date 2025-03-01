import { toTransformStream } from './to-transform-stream.ts'

async function* parseGen<T>(src: AsyncIterable<string>) {
  for await (const chunk of src) {
    yield JSON.parse(chunk) as T
  }
}

export function parseTransformStream<T>() {
  return toTransformStream(parseGen<T>)
}

async function* stringifyGen<T>(src: AsyncIterable<T>) {
  for await (const chunk of src) {
    yield JSON.stringify(chunk)
  }
}

export function stringifyTransformStream<T>() {
  return toTransformStream(stringifyGen<T>)
}
