// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const memoize = <T extends (...args: any[]) => any>(f: T): T => {
  const memory = new Map<string, ReturnType<T>>();

  const g = (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (!memory.has(key)) {
      memory.set(key, f(...args));
    }

    return memory.get(key)!;
  };

  return g as T;
};
