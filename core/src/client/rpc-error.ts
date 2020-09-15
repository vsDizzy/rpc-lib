export class RpcError extends Error {
  constructor(public detail: unknown) {
    super('RPC error.');
  }
}
