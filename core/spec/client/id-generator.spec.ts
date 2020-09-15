import { idGenerator } from '../../src/client/id-generator';

describe(idGenerator.name, () => {
  it('unique items', () => {
    const ig = idGenerator();
    const items = new Set(Array.from(new Array(10), () => ig.next().value));
    expect(items.size).toBe(10);
  });
});
