import { Host } from '../src/host';

describe(Host.name, () => {
  class Api {
    add(a: number, b: number) {
      return a + b;
    }
  }

  class RpcHost extends Host {
    process(json: string) {
      this.processMessage(json);
    }
  }

  it('example', async () => {
    const api = new Api();

    const sv: RpcHost = new RpcHost((json) => cl.process(json));
    sv.addEndpoint('api', api);

    const cl = new RpcHost((json) => sv.process(json));
    const ea = cl.getEndpoint<Api>('api');

    const res = ea.add(1, 2);
    await expectAsync(res).toBeResolvedTo(3);
  });
});
