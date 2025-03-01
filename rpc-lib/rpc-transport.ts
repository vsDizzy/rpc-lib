import { TransformStream, WritableStream } from 'node:stream/web'
import { idGen } from './id-gen.ts'
import { type Func } from './rpc-api-types.ts'
import {
  isRpcErrorResponse,
  isRpcRequest,
  type RpcPacket,
  type RpcRequest,
  type RpcResponse,
} from './rpc-transport-types.ts'

export function createRpcTransport(
  api?: Partial<{
    [method: string]: Func
  }>
) {
  const out = new TransformStream<RpcPacket, RpcPacket>()
  const writer = out.writable.getWriter()
  let writerClosedManually = false

  const inFlightRequests = new Map<number, PromiseWithResolvers<unknown>>()
  const ids = idGen()

  async function handleRequest({ id, method, params = [] }: RpcRequest) {
    try {
      const targetMethod = api?.[method]
      if (!targetMethod) {
        throw Error(`Method not found: ${method}`)
      }

      const result = await targetMethod(...params)
      if (id !== undefined) {
        writer.write({ id, result } as RpcResponse)
      }
    } catch (error) {
      if (id !== undefined) {
        writer.write({ id, error } as RpcResponse)
      }
    }
  }

  return {
    writable: new WritableStream({
      write(data: RpcPacket) {
        handlePacket(data)
      },
      close() {
        if (!writerClosedManually) {
          return writer.close()
        }
      },
    }),
    readable: out.readable,
    request<T>(method: string, ...params: unknown[]) {
      const { value: id } = ids.next() as { value: number }

      const req = Promise.withResolvers<unknown>()
      inFlightRequests.set(id, req)

      writer.write({ id, method, params } as RpcRequest)
      return req.promise as Promise<T>
    },
    notification(method: string, ...params: unknown[]) {
      writer.write({ method, params } as RpcRequest)
    },
    close() {
      writerClosedManually = true
      return writer.close()
    },
  }

  function handlePacket(data: RpcPacket) {
    if (isRpcRequest(data)) {
      handleRequest(data)
      return
    }

    handleResponse(data)
  }

  function handleResponse(res: RpcResponse) {
    const req = inFlightRequests.get(res.id)
    if (!req) {
      return
    }

    inFlightRequests.delete(res.id)

    if (isRpcErrorResponse(res)) {
      req.reject(res.error)
      return
    }

    req.resolve(res.result)
  }
}
