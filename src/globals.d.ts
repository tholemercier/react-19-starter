import type { QueryError } from "./api";

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FunctionLike = (...args: any[]) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ObjectLike = Record<string | number | symbol, any>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  type Primitive = Function | Date | number | string | boolean | null | undefined;

  type Json = string | number | boolean | null | undefined | Json[] | { [key: string]: Json };

  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
  type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;

  type StringKeyOf<T> = Extract<keyof T, string>;

  type Falsy = null | false | undefined | 0 | "" | void;

  type NeverAlternative<T, P, N> = [T] extends [never] ? P : N;
  type NeverFallback<T, F> = NeverAlternative<T, F, T>;
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: QueryError;
  }
}

// eslint-disable-next-line unicorn/require-module-specifiers
export {};
