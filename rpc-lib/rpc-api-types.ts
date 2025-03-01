export type Func = (...args: any) => unknown

type FilterProps<T, U> = {
  [p in keyof T]: T[p] extends U ? p : never
}[keyof T]
type ReplaceFuncReturnType<T extends Func, U> = (...args: Parameters<T>) => U
type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>

export type RpcRequestApi<T> = {
  [p in FilterProps<T, Func>]: T[p] extends Func
    ? ReplaceFuncReturnType<T[p], Promisify<ReturnType<T[p]>>>
    : never
}

export type RpcNotificationApi<T> = {
  [p in FilterProps<T, Func>]: T[p] extends Func
    ? ReplaceFuncReturnType<T[p], void>
    : never
}
