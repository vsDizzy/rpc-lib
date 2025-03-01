export type RpcRequest = {
  id?: number
  method: string
  params?: unknown[]
}

type RpcResponseBase = { id: number }
type RpcResultResponse = RpcResponseBase & { result: unknown }
type RpcErrorResponse = RpcResponseBase & { error: unknown }

export type RpcResponse = RpcResultResponse | RpcErrorResponse
export type RpcPacket = RpcRequest | RpcResponse

export function isRpcRequest(
  data: RpcRequest | RpcResponse
): data is RpcRequest {
  return Boolean((data as RpcRequest).method != undefined)
}

export function isRpcErrorResponse(
  response: RpcResponse
): response is RpcErrorResponse {
  return Boolean((response as RpcErrorResponse).error != undefined)
}
