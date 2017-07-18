# node-select

Node-select is a tiny (15 lines!) function that improves vastly upon the built-in `switch` statement of javascript. 

It supports lazy evaluation through arrow functions, automatic error throwing, default values, and is an expression rather than a statement, so the return value can be used. Best of all, it's much more concise than `switch`!

### Example usage

```javascript
let select = require('node-select');

let changeableValue = "Nothing your heart desires";
let unchangeableValue = "42";
let httpResponses = {
  200: "All clear!",
  204: () => { addSomeContent(); return "Nothing there"; },
  300: () => changeableValue,
  301: unchangeableValue
  404: new Error("This is not the castle you were looking for!")
  default: new Error("ERROR: DOES NOT COMPUTE. SELF DESTRUCT SEQUENCE INITIATED")
}

let statusCode = 200;
try {

  // Inline
  console.log(select(statusCode, httpResponses)); // Prints: All Clear!
  
  // Lazy evaluation
  console.log(select(300, httpResponses)); // Prints: Nothing your heart desires
  changeableValue = "Everything your heart desires"
  console.log(select(300, httpResponses)); // Prints: "Everything your heart desires";
  
  // Pre-evaluated
  console.log(select(301, httpResponses)); // Prints: "42";
  unchangeableValue = "24"
  console.log(select(301, httpResponses)); // Prints: "42";
  
  // Error throwing, default case
  console.log(select(405), httpResponses); // Prints nothing, throws an error
} catch(err) {
  console.error(err.message); // Prints: ERROR: DOES NOT COMPUTE. SELF DESTRUCT SEQUENCE INITIATED
}
```

