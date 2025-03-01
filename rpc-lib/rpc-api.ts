import {
  type Func,
  type RpcNotificationApi,
  type RpcRequestApi,
} from './rpc-api-types.ts'
import { createRpcTransport } from './rpc-transport.ts'

export function createRpcApi<T>(
  api?: Partial<{
    [method: string]: Func
  }>
) {
  const transport = createRpcTransport(api)

  return {
    ...transport,
    request: new Proxy({} as RpcRequestApi<T>, {
      get(_, p: string) {
        return function (...args: unknown[]) {
          return transport.request(p, ...args)
        }
      },
    }),
    notification: new Proxy({} as RpcNotificationApi<T>, {
      get(_, p: string) {
        return function (...args: unknown[]) {
          return transport.notification(p, ...args)
        }
      },
    }),
  }
}
