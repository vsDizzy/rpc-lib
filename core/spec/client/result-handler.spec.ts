import { ResultHandler } from '../../src/client/result-handler';
import { RpcError } from '../../src/client/rpc-error';
import { MessageType } from '../../src/message-type';

describe(ResultHandler.name, () => {
  let clock: jasmine.Clock;

  beforeEach(() => {
    clock = jasmine.clock();
    clock.install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  it('timeout when no response message', async () => {
    const rh = new ResultHandler(1000);
    const res = rh.getResult(0);
    clock.tick(1000);
    await expectAsync(res).toBeRejectedWithError();
  });

  it('timeout when wrong response id', async () => {
    const rh = new ResultHandler(1000);
    const res = rh.getResult(0);
    clock.tick(500);
    rh.handleMessage({ [MessageType.response]: { id: 1, result: 3 } });
    clock.tick(500);
    await expectAsync(res).toBeRejectedWithError();
  });

  it('result', async () => {
    const rh = new ResultHandler(1000);
    const res = rh.getResult(0);
    clock.tick(500);
    rh.handleMessage({ [MessageType.response]: { id: 0, result: 3 } });
    clock.tick(500);
    await expectAsync(res).toBeResolvedTo(3);
  });

  it('error', async () => {
    const rh = new ResultHandler(1000);
    const res = rh.getResult(0);
    clock.tick(500);
    rh.handleMessage({ [MessageType.response]: { id: 0, error: 'err' } });
    clock.tick(500);
    await expectAsync(res).toBeRejectedWithError(RpcError);
  });
});
