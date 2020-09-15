import { CallSender } from '../../src/client/call-sender';
import { MessageType } from '../../src/message-type';

describe(CallSender.name, () => {
  it('send', async () => {
    const sendRequest = jasmine.createSpy('sendRequest');
    let responseId: unknown;
    const cs = new CallSender(sendRequest, async (id) => {
      responseId = id;
      return 3;
    });
    const res = cs.send({ endpoint: 'api', method: 'add', params: [1, 2] });

    expect(sendRequest).toHaveBeenCalledWith({
      [MessageType.request]: {
        responseId,
        call: { endpoint: 'api', method: 'add', params: [1, 2] },
      },
    });
    await expectAsync(res).toBeResolvedTo(3);
  });
});
