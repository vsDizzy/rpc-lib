export function* idGenerator(max = 0x10000): Generator<number, number, never> {
  let i = 0;
  while (true) {
    i %= max;
    yield i++;
  }
}
