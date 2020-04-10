import select from "./index";

enum Test {
  first,
  second,
}

function withParam(test: Test) {
  const result = select(test, {
    [Test.first]: "hi",
    [Test.second]: "bye",
  });
  console.log(result);
}

withParam(Test.first);
