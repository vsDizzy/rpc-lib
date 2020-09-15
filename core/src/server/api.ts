export type Api<T> = MapProps<Pick<T, FilterProps<T>[keyof T]>>;

type MapProps<T> = { [P in keyof T]: ReplaceReturnType<T[P]> };

type ReplaceReturnType<T> = T extends IsFunction<T>
  ? ReturnType<T> extends Promise<unknown>
    ? T
    : (...args: Parameters<T>) => Promise<ReturnType<T>>
  : never;

type IsFunction<T> = T extends (...args: unknown[]) => unknown ? T : never;

type FilterProps<T> = {
  [P in keyof T]: T[P] extends IsFunction<T[P]> ? P : never;
};
