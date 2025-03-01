export function* idGen(startId = 0) {
  let id = startId

  while (true) {
    yield id++
    id >>>= 0
  }
}
