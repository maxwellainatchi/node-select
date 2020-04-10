type Lazy<T> = () => T | Error;
type ResultType<T> = T | Error | Lazy<T>;

type DefaultCase<Type> = { default_case: keyof Type };
type DefaultValue<Result> = { default: Result };
type Default<Type, Result> = DefaultCase<Type> | DefaultValue<Result>;

export type Map<Type, Result> = {
  [Prop in keyof Type]: Result;
};

export type Cases<Type, Result> =
  | Map<Type, Result>
  | (Partial<Map<Type, Result>> & Default<Type, Result>);

export interface Options {
  autoCall?: boolean;
  autoThrow?: boolean;
  parseObjectTree?: boolean;
}

const isLazy = <Result>(val: ResultType<Result>): val is Lazy<Result> =>
  typeof val === "function";

export default function select<Type, Result>(
  value: keyof Type,
  cases: Cases<Type, ResultType<Result>>,
  options: Options = {}
): Result {
  const { autoCall = true, autoThrow = true } = options;

  let result: ResultType<Result> | undefined = cases[value];
  if (!result) {
    if ("default" in cases) {
      result = cases.default;
    } else if ("default_case" in cases) {
      result = cases[cases.default_case];
    }
  }
  if (!result) {
    throw new Error();
  }
  if (autoCall && isLazy(result)) {
    result = result();
  }
  if (autoThrow && result instanceof Error) {
    throw result;
  }
  return result as Result;
}
