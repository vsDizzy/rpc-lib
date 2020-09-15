import { RpcError } from '../../src/client/rpc-error';

describe(RpcError.name, () => {
  it('error instance', () => {
    const re = new RpcError(null);
    expect(re).toBeInstanceOf(Error);
  });
});
