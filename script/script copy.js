import * as calculator from "./calculator.js";

let screen = document.getElementById("screen");
let clearText = false;

for (const button of document.getElementsByTagName("button")) {
  const text = button.innerText;
  if (text === "=")
    button.addEventListener("click", () => onEquals())
  else
    button.addEventListener("click", () => addChar(text));
}

document.addEventListener("keypress", (e) => {
  const key = e.key;
  console.log(key);
  if (/[0-9\.+\-*/]/g.test(key))
    addChar(key);
  else if (key === "Enter") 
    onEquals();
});

function addChar(char) { 
  if (!verifyCanAddChar(char))
    return;

  let concat = screen.innerText + char;
  screen.innerText = clearText && !/[+\-*/]/g.test(char) ? char 
    : concat.length !== 2 || char === "." || /[+\-*/]/g.test(char) 
      ? concat 
      : removeHeadZeroAppendChar(concat);

  clearText = false;
}

function onEquals() {
  const text = screen.innerText;
  let numbers = splitNumbers(text);
  console.log(numbers.toString());
  let operatorsArray = splitOperators(text);
  let operators = operatorsArray[Symbol.iterator]();

  screen.innerText = numbers.reduce((accumulator, currentValue) => {
    return accumulator === null ? currentValue : parseOperators(operators.next().value, accumulator, currentValue);
  }, null);

  clearText = true;
}

function splitNumbers(text) {
  return text.split(/[+\-/*]/g).map((s) => +s);
}

function splitOperators(text) {
  let array = text.split(/[0-9\.]+/g);
  // First and last element will always be blank.
  array.shift();
  array.pop();
  return array;
}

function verifyCanAddChar(char) {
  if (/[0-9]/.test(char))
    return true;
  let text = screen.innerText;
  let previousChar = text.substring(text.length - 1);
  return char !== previousChar;
}

function removeHeadZeroAppendChar(text) {
  if (text[0] === "0")
    return text.substring(1);
  
  return text;
}

function parseOperators(operator, a, b) {
  switch (operator) {
    case "+":
      return calculator.add(a, b);
    case "-":
      return calculator.subtract(a, b);
    case "*":
      return calculator.multiply(a, b);
    case "/":
      return calculator.divide(a, b);
    default:
      throw new Error(`Operator: ${operator} not found.`);
  }
}