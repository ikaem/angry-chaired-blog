---
title: "TypeScript & Webpack Calculator: Coding Calculator with TypeScript"
date: 2020-09-04 15:16:04
tags:
  - typescript
categories: ts webpack calculator
cover: alan-fung-z6z-Vq4eJhc-unsplash.jpg
creditArtist: Alan Fung
creditSource: https://unsplash.com/@herrfung?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 2 of 3 in TypeScript & Webpack Calculator

The [original calculator](https://www.youtube.com/watch?v=j59qQ7YWLxw)) that we are copying was made with Vanilla JS. We are going to be using TypeScript. This requires us to set up and configure TypesScript. We will also use modules, which the original did not have. Why? Because we can, that's why.

<!--more-->

#### See [Project Information](#Project-Information)

Main focus of this post is the calculator logic. In its final form, the code is a shameless copy of the original. Still, I will also provide examples and description of my numerous) attempts to code the same functionality, note the biggest differences, and share what I thought were particularly impressive solutions to problems in my own code.

Let's start from the beginning, however.

## Step 2: TypeScript setup and coding the calculator

Here is what we will do:

1. Set up and configure TypeScript
2. Code the calculator
3. Create modules

### Set up and configure TypeScript

First things first: to work with TypeScript, we should have it installed globally on our system.

```bash
npm i -g typescript
```

Next, we want to configure the TypeScript setup for this particular project.
To do that, we need to create a TS configuration file in the root of the project. We do so with the command:

```bash
tsc --init
```

This command creates a **tsconfig.json** file in the project root.

If you open the file, you will see lots of options, most of them commented out. It is a lengthy one, and we won't go through all of it. Instead, we will focus only on the opetions that get this particular app running.

At the top of the file, we see the **target** field set to **es5**. While this is fine, we will go ahead and change this to **es6**. This effectively makes TypeScript compile all .ts files to the ES6 version of JavaScript. While ES5 is supported by more browsers, it being older, we will need ES6 for modules and few methods used in the app.

```js
{
  "compilerOptions": {
    //   ...
    "target": "es6",
// ...
```

Next option is **module**. This sets module loader for our app. Module loader is used to locate and execute dependencies of modules. Default loader here is **commonjs**, but we will change this to **"es2015"**, to use ES2015 (ES6) module loader.

```js
"target": "es6"
```

Next is **sourceMap**. We will have this set as **true**, to make sure TS map files are created for every .ts file in the project. I am very fluent in this, but what I know is that this way we will be able to see TS files in the source tab of Chrome Developer Tools, instead of having access only to compiled JS files. This is mostly used for debugging.

```js
"sourceMap": true,
```

Next is **outDir**. We will uncomment this, and set it to **"./public"**. Now, TypeScript will output compiled .ts files to the **public** folder, which is where we have our **index.html**.

```js
"outDir": "./public",
```

We also need to specify a folder which TypeScript will use as a source of .ts files to be compiled into JS. We do this with the **rootDir** option. We uncomment this and set it to **"./src"**, which is the path of our source folder.

```js
"rootDir": "./src",
```

We will also add a field to the config file, to specify that the TS compiler should not generate JS files in case it finds an error in a TS file.
The field we add is **noEmitOnError**, and we set it to **true**.

```js
"noEmitOnError": true,
```

Nice. With this, we have configured our TypeScript project. Let's create an **app.ts** file in the **src** folder, and then have TS compiler watch our project.

```bash
tsc -w
```

This command should result in a **app.js** file created in the **public** folder, as specified in the **tsconfig.json** file.

Last thing to do is to connect **index.html** with the **app.js** script. We will add the **defer** attribute to the **script** tag, to make sure the script runs only after the page has fully loaded:

```html index.html
<script src="app.js" defer></script>
```

### Code the calculator

In this part we will skip selecting DOM elements, and will jump directly into coding the app.
The approach I take here is to describe my logic, and then show how the original solution solved a problem that my code could not.

First, about the calculator.
The calculator can do four operations: addition, deduction, multiplication and division. It can chain operations, meaning that we can do an operation with a result of a previous operation. Obviously, it can compute a result of an operation, regardless of how long the operation chain is. It can also delete digits of a number we want to perform an operation on, and it can reset the whole thing. Finally, it can do operations with decimal numbers.
As for displaying values, it has its "screen" split in two parts. The main, bottom part, is used to show the current number as well as the result of an operation. The top screen is used to show a previous number together with the current operator.

We will start with creating a calculator class.
The class I created had multiple fields on it, at one point reaching as many as six:

- this.currentValue
- this.previousValue
- this.operator
- this.result
- this.currentDisplayString
- this.previousDisplayString

The idea was that I would use currentValue fields to do the math with, and the displayStrings ones for rendering displays.
The result, I thought, was needed to store the current result of the operation.

The original code had three properties. Those were **currentOperand**, **previousOperand**, and **operation**. It didn't need the strings, nor the result.

Here is the original code:

```js
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }
```

This was a bit of a revelation for me.
All along I tried to separate calculation from the view, but with only one field for each value, the original didn't care about that.
Big surprise was that there was no **result** variable. In my approach, I was so keen on the **result** property, that for a long time I didn't even have the **previouValue** property. I used **result** instead. I still think it could be done, because we always integrate current value into the result, but my mind got all tangled up in combinations.

Moving on to the class methods.

I originally imagined six different methods:

- updateCurrentNumber
- setOperation
- doCalculation
- printResult
- updateCurrentScreen
- updatePreviousScreen

At one point I had two more methods that would format strings for the display. Talk about a "simple" calculator.

On the other hand, the original has four methods:

- appendNumber
- chooseOperation
- compute
- updateDisplay

Only four of them? Now, that is simple.

Here is my logic:

- **updateCurrentNumber** gets a value from a calculator button and stores it into the **currentValue**. It then sets the **currentDisplayString**, and calls the **updateCurrentScreen** method to display the **currentDisplayString**.
- **setOperation** checks if the **currentValue** exists. If it doesn't, it returns, not allowing any operations until a number on the calculator is clicked. If the **currentValue** is valid, it proceeds to set the **operator** sent from the calculator. It also calls **doCalculation** function, which calculates the result. After this is done, the **setOperation** method sets the **currentDisplayString** to an empty string, and calls the **updateCurrentScreen**. Then, it moves **currentValue** to the **previousValue**, sets the **previousDisplayString**, and calls **updatePreviousScreen**. Finally, it deletes **currentValue**, and then resets the **operator**.
- **doCalculation** checks if there is anything in the **result**. If there is not, it just sets the **currentValue** to the result, and returns. The idea is that we will use this **result** as a previous value in the following calculations. If there already is a **result** value, we do the math where the result is on the left side of whatever operation happens, and we store the operation result in the **result** again
- **printResult** is a method called by pressing the "**equals**" button. It calls **doCalculation** to do the math again. When the calculation is done, it sets the **currentDisplayString**, and calls the **updateCurrentScreen** method. It also sets the **previousDisplayString**, and calls **updatePreviousScreen**. It then deletes **currentValue** and deletes the **operator**.

The **printResult** is where the problems show (besides the fact that even writing about the whole thing is convulted).

1. When calling the **doCalculation** method, there might be no **operator** to work with, because the **setOperation** removed the operator when it returned. I tried keeping the operator in memory, but this caused another problem where we could click on an operator just before clicking on equals, and changing the whole operation.
2. Assuming the math in **doCalculation** was successful, **currentValue** gets deleted. But, valid **currentValue** is required to access the **setOperation** method again in cases when a user wants to continue calculation.
3. If we decide to remove the above mentioned condition, we still have a problem. The **currentValue** that is in the memory gets computed **again** into the result after we click an operation. This results in bad math.
4. And finally, the operation chain that I wanted to show in the previous screen. I wanted to concatanate all **previousValue** instances together with their operators, to show a long operation chain all the time. This was completely unnecessary. The original wasn't even considering that.

Now here is what the original did.

First major difference is that they had all of their buttons always call the **updateDisplay** method right after their primary method.

In this example, the **numberButton** calls the **appendNumber**, and then immediately calls the **updateDisplay** method.

```js Buttons always call their primary function and updateDisplay function
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});
```

Here is the **updateDisplay** method. Ignore the **getDisplayNumber** method, which is used only to format the **currentOperand** and **previousOperand** strings.
When called, the **updateDisplay** always shows the **currentOperand** on the screen.
And if there was a valid **operation** variable set in the memory, the previous screen will render the **operator** together with the **previousOperand**. Otherwise, the previous screen renders an empty string.

```js
  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}
```

This was beautiful to me. It meant that I didn't have to worry about when to render which data, and what to send to current and what to send to the previous screen. The method did that. Lovely.

It gets better.

Next method, **chooseOperation** (mine **setOperation**), allows entry only if there is a valid **currentOperand** This is what I did too.

It also has another condition that says that if there is a **previousOperand** too, we should call the **compute** method to calculate the result. This part is basically same as mine. I always called the **doCalculation** method, moving **currentValue** to the **result** if the result was empty.
The original **chooseOperation** does that too, just after **compute** returns. It moves **currentOperand** to **previousOperand**, sets the **operator**, and finally resets the **currentOperand**

```js

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }
```

Note how **chooseOperation** sets the **operator**. After it returns, **updateDisplay** is called, as usual. Since there is nothing in the **currentValue**, it will render an empty main screen. But, the **operation** value is valid, so the previous screen renders both **previousOperand** and the **operation**.

The "better" comes with the **compute** method. Along with being called by the **chooseOperation** method, it is allso called by the **equals** button on the calculator.
Since there is no **result** field in the Calculator class, the method creates its own **result** variable, does a routing check to see if both operands are actually valid numbers, and then it calculates the result. All good so far.
Then, it moves the **result** to the **currentOperand**, resets the **operation**, and empties the **previousOperand**.

```js
  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break
      case '*':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }
```

The "better" part is the move of result to the **currentOperand**.
Think about what this does.

- It allows entry into **chooseOperation** again, even after we click **equals**
- It sets up the future **previousOperand** after we click an operator button again. This effectively turns the **previousOperand** into the missing **result** variable. It allows for continuous calculation with reliable values, unlike my solution where a click on an operator after we get an **equals** result will mess up the math.

After multiple attempts to code the calculator on my own, and never managing to get all features actually working, I admit I am super impressed with how elegant the original code is.

Few other things that I also found neat were:

- The **updateDisplay** method takes care of both screens. I had two methods from the start, and then I see that one is enough
- The original does not actually declare any fields directly on the class. Instead, the **clear** method sets those when called, which immediately after an intance of the Calculator class is created. **clear** is also called by the **AC** button on the calculator to reset all values.
- **parseFloat()** is better than the **Number()** function for this particular case. In case of an empty string, **Number** will convert it to zero, while **parseFloat** will result with **NaN**. I imagine me using **Number()** was caused many problems I wasn't even aware of.
- The simplicity of it.

Very good. Thank you WDS.

### Create modules

To makes this app as much of an overkill as possible, let's split the app logic into two modules:

- calculator.ts, which exports the **Calculator** class
- app.ts, which contains DOM selectors and calculator methods calls

Here is the Calculator module:

```ts The Calculator class module
export default class Calculator {
  currentValue = "";
  previousValue = "";
  operator = "";

  constructor(
    public currentOperandScreen: HTMLDivElement,
    public previousOperandScreen: HTMLDivElement
  ) {
    this.clearAll();
  }

  updateCurrentValue = (newValue: string) => {
    if (newValue === "." && this.currentValue.includes(".")) return;
    this.currentValue = this.currentValue + newValue;
  };

  setOperation = (operator: string) => {
    if (!this.currentValue) return;
    if (this.previousValue) this.calculateResult();

    this.operator = operator;
    this.previousValue = this.currentValue;
    this.currentValue = "";
  };

  calculateResult = () => {
    let result: number;

    let previousNumber = Number(this.previousValue);
    let currentNumber = Number(this.currentValue);

    if (isNaN(previousNumber) || isNaN(currentNumber)) return;

    switch (this.operator) {
      case "+":
        result = previousNumber + currentNumber;
        break;

      case "-":
        result = previousNumber - currentNumber;
        break;

      case "*":
        result = previousNumber * currentNumber;
        break;

      case "÷":
        result = previousNumber / currentNumber;
        break;

      default:
        return;
    }

    this.currentValue = String(result);
    this.previousValue = "";
    this.operator = "";
  };

  updateDisplay = () => {
    this.currentOperandScreen.textContent = this.currentValue;

    this.previousOperandScreen.textContent = this.previousValue
      ? this.previousValue + this.operator
      : "";
  };

  deleteLastDigit = () => {
    this.currentValue = this.currentValue.slice(0, -1);
  };

  clearAll = () => {
    this.currentValue = "";
    this.previousValue = "";
    this.operator = "";
  };
}
```

And here is the App module:

```ts The module with rest of the app logic
import Calculator from "./calculator.js";

const previousOperandDiv = document.querySelector(
  "[data-previous-operand]"
) as HTMLDivElement;
const currentOperandDiv = document.querySelector(
  "[data-current-operand]"
) as HTMLDivElement;
const calcNumbers = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]")!;
const deleteButton = document.querySelector("[data-delete]")!;
const clearAllButton = document.querySelector("[data-clear-all]")!;

const calculator = new Calculator(currentOperandDiv, previousOperandDiv);

equalsButton.addEventListener("click", () => {
  calculator.calculateResult();
  calculator.updateDisplay();
});

console.log("zgg");

operationButtons.forEach((operationButton) => {
  operationButton.addEventListener("click", () => {
    calculator.setOperation(operationButton.textContent!.trim());
    calculator.updateDisplay();
  });
});

calcNumbers.forEach((calcNumber) => {
  calcNumber.addEventListener("click", () => {
    calculator.updateCurrentValue(calcNumber.textContent!.trim());
    calculator.updateDisplay();
  });
});

deleteButton.addEventListener("click", () => {
  calculator.deleteLastDigit();
  calculator.updateDisplay();
});

clearAllButton.addEventListener("click", () => {
  calculator.clearAll();
  calculator.updateDisplay();
});
```

To make sure our modules actually work, we do have to make few adjustments.

1. Have **module** field set to **es2015** and **type** field set to **es6** in the **tsconfig.json** file
2. Make sure we include **."js"** extensions on modules when we import them. This is because we are compiling our modules into JS, and we can't have JS modules import TS ones. We already did that in the **app.ts** module above.
3. Add **type** attribute to the **script** tag which loads our application, and give it a value of **module**. This will let the browser know that this script is a module
4. Remove the **defer** attribute from the script tag. Modules defer by default.

```html index.html snippet
<script src="app.js" type="module"></script>
```

Ok, that's it. If the **tsc -w** command is still running, valid JS modules should be compiled into the **public** folder. 

Great. We finished the TS and coding part. Despite being a bit hard to put it all into words, and after not being able to complete the actual calculator on my own, I find it rewarding. The simplicity of WDS's code came as a relief and inspiration to keep on trying. 
We also installed TS and set up the modules, and now have a neat little app that works.

In the next post we will complicate it a bit more, and squeeze the app through a tool call Webpack. See you there. 

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at

- [Github repository](https://github.com/ikaem/overkillkulator)
- [Live website](http://kaem.freecluster.eu/apps/overkillkulator/)

### Goals

1. Copy Web Development Simplified's JS calculator with TypeScript and Webpack
2. Use Tailwind to style the app

### Steps

1. Setup and styling with Tailwind
2. **TypeScript setup and coding the calculator**
3. Webpack setup

### Tech and Tools

1. Tailwind
2. TypeScript
3. Webpack

### Experience with Tech & Tools

I haven't done anything with Tailwind before, except for few crash courses. I did a course on Webpack setup, too, and used that as a guide for this project. As for TypeScript, I think that by now I settled into using it comfortably on a limited level.

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.
