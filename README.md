# lightpost
A lightweight language based on postfix notation.

Live demo: [http://andrewmorris.io/lightpost](http://andrewmorris.io/lightpost)

# Install

```
$ npm install -g lightpost
$ lightpost
> "Hello world!" print
Hello world!
> (Ctrl+D)
$ echo '"Hello world!" print' >hello.lp
$ lightpost hello.lp
Hello world!
```

# Basics

```
> // Post-fix notation means the operator comes after its operands:
> 1 1 +

> // Now 2 is on the stack. To see this, use the inspect command:
> inspect
Stack: [2]
Variables: {}
Module Variables: {}

> // When the interpreter encounters a value, it simply pushes it onto
> // the stack. When it encounters a function (or operator, same thing
> // as far as lightpost is concerned), it pops the number of arguments
> // needed by the function, executes it, and pushes the output onto
> // the stack. print is a function which takes one argument, prints
> // it, and returns nothing:
> print
2

> // An unassigned identifier is considered to be a value. So x here
> // will just get pushed onto the stack:
> x
> inspect
Stack: [{"type":"variable","name":"x"}]
Variables: {}
Module Variables: {}

> // To assign to x, use =. Usually it's more readable to put
> // `x 7 =` on one line, but since x is already on the stack, omit
> // the x:
> 7 =
> inspect
Stack: []
Variables: {"x":7}
Module Variables: {}

> // Now when x is passed to a function, the function will receive
> // the value stored in x, instead of x itself:
> x x * print
49

> // Functions are first-class citizens in lightpost. They can be
> // treated as values, passed to other functions, and functions
> // can return functions. To treat a function as a value, append
> // # to suppress execution:
> 1 1 +#
> inspect
Stack: [1,1,{"type":"function","value":{"argc":2}}]
Variables: {"x":7}
Module Variables: {}

> // exec is a function which takes another function and executes
> // it. So this will execute +, which will then take the two 1s
> // and push a 2 back on the stack:
> exec
> inspect
Stack: [2]
Variables: {"x":7}
Module Variables: {}

> print
2

> // The @ makes a variable module-global (modules are a planned
> // feature, for now they're fully global):
> plus@ +# =
> 1 1 plus@ print
2

> // The nice thing about post-fix notation is that it eliminates
> // the need for parentheses. So in lightpost, parentheses are
> // used to create functions instead:
> ("Hello world!" print)
Hello world!

> // But lightpost will execute the functions you create just like
> // others, so to assign it to a variable, remember the # to
> // suppress execution:
> sayHello ("Hello world!" print)# =
> sayHello
Hello world!
> sayHello
Hello world!

> // When inside a function, use the special pull function to pull
> // items from the parent stack. In the example below,
> // timesTwoPlusOne takes one argument with `1 pull`, then
> // multiplies it by 2 and adds one, and by leaving the result on
> // the stack, the result is returned:
> timesTwoPlusOne (1 pull 2 * 1 +)# =
> 7 timesTwoPlusOne print
15
```

# Run the Website

```
git clone git@github.com:voltrevo/lightpost.git
cd lightpost
npm install
npm run website
```

[http://localhost:8080/](http://localhost:8080/)

# API

`npm install --save lightpost`

```
'use strict'

var lightpost = require('lightpost')

var interpreter = new lightpost.interpreter(
  function(outputStr) {
    console.log('Lightpost output:', outputStr)
  },
  function(errorStr) {
    console.error('Lightpost error:', errorStr)
  }
)

interpreter.handle_string('"Hello world!" print\n')
```
