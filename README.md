# node-select

Node-select is a tiny (15 lines!) function that improves vastly upon the built-in `switch` statement of javascript. 

It supports lazy evaluation through arrow functions, automatic error throwing, default values, and is an expression rather than a statement, so the return value can be used. Best of all, it's much more concise than `switch`!

### Example usage

```javascript
let select = require('node-select');

let changeableValue = "Nothing your heart desires";
let httpResponses = {
  200: "All clear!",
  204: () => { addSomeContent(); return "Nothing there"; },
  300: () => changeableValue,
  404: new Error("This is not the castle you were looking for!")
  default: new Error("ERROR: DOES NOT COMPUTE. SELF DESTRUCT SEQUENCE INITIATED")
}

let statusCode = 200;
try {
  console.log(select(statusCode, httpResponses)); // Prints: All Clear!
  console.log(select(300, httpResponses)); // Prints: Nothing your heart desires
  console.log(select(405), httpResponses); // Prints nothing
} catch(err) {
  console.error(err.message); // Prints: ERROR: DOES NOT COMPUTE. SELF DESTRUCT SEQUENCE INITIATED
}


```

