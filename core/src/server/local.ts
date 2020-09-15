import { Call } from '../call';

export class Local {
  private endpoints = new Map<string, object>();

  async callEndpoint({ endpoint, method, params }: Call) {
    const ep = this.endpoints.get(endpoint);
    if (!ep) {
      throw new Error(`Endpoint not found: ${endpoint}`);
    }

    if (!ep[method]) {
      throw new Error(`Method not found: ${method}`);
    }

    return await ep[method](...params);
  }

  addEndpoint(name: string, value: object) {
    this.endpoints.set(name, value);
  }
}
