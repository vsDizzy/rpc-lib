import { Call } from '../../src/call';
import { Remote } from '../../src/server/remote';

describe(Remote.name, () => {
  interface Api {
    add(a: number, b: number): number;
  }

  it('invoke method', () => {
    const cb = jasmine.createSpy('cb');
    const remote = new Remote(cb);
    const ep = remote.getEndpoint<Api>('api');
    ep.add(1, 2);
    expect(cb).toHaveBeenCalledWith({
      endpoint: 'api',
      method: 'add',
      params: [1, 2],
    } as Call);
  });
});
