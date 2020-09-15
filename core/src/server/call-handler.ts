import { Call } from '../call';
import { MessageType } from '../message-type';
import { Request } from '../request';
import { Response } from '../response';

export class CallHandler {
  constructor(
    private callEndpoint: (call: Call) => Promise<unknown>,
    private send: (message: object) => void
  ) {}

  async handleMessage(message: object) {
    const request: Request = message[MessageType.request];
    if (!request) {
      return;
    }

    let data: { result: unknown } | { error: unknown };
    try {
      const result = await this.callEndpoint(request.call);
      data = { result };
    } catch (error) {
      data = { error };
    }

    this.send({
      [MessageType.response]: { id: request.responseId, ...data } as Response,
    });
  }
}
