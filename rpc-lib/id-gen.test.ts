import { suite, test, type TestContext } from 'node:test'
import { idGen } from './id-gen.ts'

suite(idGen.name, () => {
  test('generates sequential ids', (t: TestContext) => {
    const actual = idGen().take(3).toArray()
    t.assert.deepStrictEqual(actual, [0, 1, 2])
  })

  test('generates ids over signed int32', (t: TestContext) => {
    const actual = idGen(0x7fff_ffff).take(3).toArray()
    t.assert.deepStrictEqual(actual, [0x7fff_ffff, 0x8000_0000, 0x8000_0001])
  })

  test('generates ids over unsigned int32', (t: TestContext) => {
    const actual = idGen(0xffff_ffff).take(3).toArray()
    t.assert.deepStrictEqual(actual, [0xffff_ffff, 0, 1])
  })
})
