import { MessageType } from '../message-type';
import { Response } from '../response';
import { RpcError } from './rpc-error';

interface PromiseExecutor {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

export class ResultHandler {
  private requests = new Map<unknown, PromiseExecutor>();

  constructor(private timeoutMs: number) {}

  getResult(id: unknown) {
    let disposeResult: () => void;
    let disposeTimeout: () => void;

    return new Promise((resolve, reject) => {
      disposeResult = this.createResult(id, resolve, reject);
      disposeTimeout = this.createTimeout(reject);
    }).finally(() => {
      disposeTimeout();
      disposeResult();
    });
  }

  private createResult(
    id: unknown,
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void
  ) {
    this.requests.set(id, { resolve, reject });

    return () => this.requests.delete(id);
  }

  private createTimeout(reject: (reason?: any) => void) {
    const th = setTimeout(
      () => reject(new Error(`Timed out after ${this.timeoutMs} ms.`)),
      this.timeoutMs
    );

    return () => clearTimeout(th);
  }

  handleMessage(message: object) {
    const response: Response = message[MessageType.response];
    if (!response) {
      return;
    }

    const executor = this.requests.get(response.id);
    if (!executor) {
      return;
    }

    if (response.error) {
      executor.reject(new RpcError(response.error));
    } else {
      executor.resolve(response.result);
    }
  }
}
