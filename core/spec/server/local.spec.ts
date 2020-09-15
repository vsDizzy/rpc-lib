import { Local } from '../../src/server/local';

describe(Local.name, () => {
  const api = {
    add(a: number, b: number) {
      return a + b;
    },
  };

  it('simple method', async () => {
    const local = new Local();
    const add = spyOn(api, 'add').and.callThrough();
    local.addEndpoint('api', api);
    const res = local.callEndpoint({
      endpoint: 'api',
      method: 'add',
      params: [1, 2],
    });
    await expectAsync(res).toBeResolvedTo(3);
    expect(add).toHaveBeenCalledWith(1, 2);
  });

  it('endpoint not found', async () => {
    const local = new Local();
    local.addEndpoint('api', api);
    const res = local.callEndpoint({
      endpoint: 'unexisting',
      method: 'add',
      params: [1, 2],
    });
    await expectAsync(res).toBeRejectedWithError(/Endpoint not found/);
  });

  it('method not found', async () => {
    const local = new Local();
    local.addEndpoint('api', api);
    const res = local.callEndpoint({
      endpoint: 'api',
      method: 'unexisting',
      params: [1, 2],
    });
    await expectAsync(res).toBeRejectedWithError(/Method not found/);
  });

  it('check this', async () => {
    class Api {
      name = 'my-api';

      getName() {
        return this.name;
      }
    }
    const api = new Api();

    const local = new Local();
    local.addEndpoint('api', api);
    const res = local.callEndpoint({
      endpoint: 'api',
      method: 'getName',
      params: [],
    });
    await expectAsync(res).toBeResolvedTo('my-api');
  });
});
