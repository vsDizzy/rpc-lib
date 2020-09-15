import { Call } from '../call';
import { Api } from './api';

export class Remote {
  constructor(private callFn: (call: Call) => unknown) {}

  getEndpoint<T extends object>(name: string) {
    return this.wrap<T>(name);
  }

  private wrap<T>(
    endpoint: string,
    path = [],
    target = function () {}
  ): Api<T> {
    return new Proxy(target, {
      get: (target, p: string) => this.wrap(endpoint, [...path, p], target),
      apply: (target, thisArg, argArray) =>
        this.callFn({ endpoint, method: path.join('.'), params: argArray }),
    }) as any;
  }
}
