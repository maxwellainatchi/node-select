type DefaultCase<Type> = { default_case: keyof Type };
type DefaultValue<Result> = { default: Result };
type Default<Type, Result> = DefaultCase<Type> | DefaultValue<Result>;

type ResultType<T> = T | Error | Lazy<T>;
type Lazy<T> = () => T | Error;

type PartialMap<Type, Result> = {
  [Prop in keyof Type]?: Result;
};

export type PartialCases<Type, Result> = PartialMap<Type, Result> &
  Default<Type, Result>;

export type ExhaustiveCases<Type, Result> = {
  [Prop in keyof Type]: Result;
};

export type Cases<Type, Result> =
  | ExhaustiveCases<Type, Result>
  | PartialCases<Type, Result>;

export interface Options {
  autoCall?: boolean;
  autoThrow?: boolean;
  parseObjectTree?: boolean;
}

function hasDefaultCase<Type, Result>(
  cases: PartialCases<Type, Result>
): cases is PartialCases<Type, Result> & DefaultCase<Type> {
  let tester = cases as PartialCases<Type, Result> & DefaultCase<Type>;
  return !!tester.default_case;
}

function hasDefaultValue<Type, Result>(
  cases: PartialCases<Type, Result>
): cases is PartialCases<Type, Result> & DefaultValue<Result> {
  let tester = cases as PartialCases<Type, Result> & DefaultValue<Result>;
  return !!tester.default;
}

function isExhaustive<Type, Result>(
  cases: Cases<Type, Result>
): cases is ExhaustiveCases<Type, Result> {
  const tester = cases as PartialCases<Type, Result>;
  return hasDefaultCase(tester) || hasDefaultValue(tester);
}

function isLazy<Result>(val: ResultType<Result>): val is Lazy<Result> {
  if (typeof val === "function") {
    return true;
  }
  return false;
}

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

export default function select<Type, Result>(
  value: keyof Type,
  cases: Cases<Type, ResultType<Result>>,
  options: Options = {}
) {
  const {
    autoCall = true,
    autoThrow = true,
    parseObjectTree = false,
  } = options;

  let result: ResultType<Result> | undefined;
  if (cases[value]) {
    result = cases[value];
  } else if (!isExhaustive(cases) && hasDefaultValue(cases)) {
    result = cases.default;
  } else if (!isExhaustive(cases) && hasDefaultCase(cases)) {
    result = cases[cases.default_case];
  }
  if (autoCall && isLazy(result)) {
    result = result();
  }
  if (autoThrow && result instanceof Error) {
    throw result;
  }
  return result;
}

enum Test {
  first,
  second,
}

const test: Test = Test.first;

select(test, {
  [Test.first]: "hi",
});
