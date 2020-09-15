import { Call } from '../../src/call';
import { MessageType } from '../../src/message-type';
import { Request } from '../../src/request';
import { CallHandler } from '../../src/server/call-handler';

describe(CallHandler.name, () => {
  it('handleMessage', async () => {
    const callEndpoint = jasmine.createSpy('callEndpoint').and.resolveTo(3);
    const send = jasmine.createSpy('send');
    const ch = new CallHandler(callEndpoint, send);
    await ch.handleMessage({
      [MessageType.request]: {
        responseId: 0,
        call: {
          endpoint: 'api',
          method: 'add',
          params: [1, 2],
        },
      } as Request,
    });

    expect(callEndpoint).toHaveBeenCalledWith({
      endpoint: 'api',
      method: 'add',
      params: [1, 2],
    } as Call);
    expect(send).toHaveBeenCalledWith({
      [MessageType.response]: { id: 0, result: 3 },
    });
  });
});
