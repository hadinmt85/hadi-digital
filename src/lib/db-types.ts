export type QueryFn = <T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
) => Promise<T[]>;
