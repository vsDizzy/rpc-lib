import { Call } from './call';
import { CallSender } from './client/call-sender';
import { ResultHandler } from './client/result-handler';
import { CallHandler } from './server/call-handler';
import { Local } from './server/local';
import { Remote } from './server/remote';

export abstract class Host {
  private resultHandler = new ResultHandler(10000);

  private local = new Local();
  private callHandler = new CallHandler(
    (call: Call) => this.local.callEndpoint(call),
    (message: object) => this.sendMessage(message)
  );

  private callSender = new CallSender(
    (message: object) => this.sendMessage(message),
    (id: unknown) => this.resultHandler.getResult(id)
  );
  private remote = new Remote((call: Call) => this.callSender.send(call));

  constructor(private send: (json: string) => void) {}

  protected processMessage(json: string) {
    const message = JSON.parse(json);
    this.callHandler.handleMessage(message);
    this.resultHandler.handleMessage(message);
  }

  private sendMessage(message: object) {
    const json = JSON.stringify(message);
    this.send(json);
  }

  addEndpoint(name: string, value: object) {
    this.local.addEndpoint(name, value);
  }

  getEndpoint<T extends object>(name: string) {
    return this.remote.getEndpoint<T>(name);
  }
}
