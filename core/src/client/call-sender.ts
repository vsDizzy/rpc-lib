import { Call } from '../call';
import { MessageType } from '../message-type';
import { Request } from '../request';
import { idGenerator } from './id-generator';

export class CallSender {
  private idIterator = idGenerator();

  constructor(
    private sendRequest: (request: object) => void,
    private getResult: (id: unknown) => Promise<unknown>
  ) {}

  async send(call: Call) {
    const id = this.idIterator.next().value;
    const request = {
      [MessageType.request]: {
        responseId: id,
        call,
      } as Request,
    };
    this.sendRequest(request);
    return this.getResult(id);
  }
}
