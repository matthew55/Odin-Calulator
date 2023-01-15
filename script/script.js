import * as calculator from "./calculator.js";

let stage = 1;
let firstCharOfStageTwo = false;

let firstNumber = null
let operator = null;
let secondNumber = null

const screen = document.getElementById("screen");

for (const button of document.getElementsByTagName("button")) {
  const classList = button.classList;
  const innerText = button.innerText;
  if (classList.contains("number"))
    button.addEventListener("click", () => addChar(innerText));
  else if (classList.contains("operator"))
    button.addEventListener("click", () => onOperator(innerText));
  else if (classList.contains("equals"))
    button.addEventListener("click", () => onEquals());
  else if (classList.contains("clear-all"))
    button.addEventListener("click", () => clearAll());
  else if (classList.contains("clear-entry"))
    button.addEventListener("click", () => clearEntry());
  else if (classList.contains("plus-minus"))
    button.addEventListener("click", () => plusMinus());
}

document.addEventListener("keypress", (e) => {
  const key = e.key;
  console.log(key);
  if (/[0-9\.]/g.test(key))
    addChar(key);
  else if (/[+\-*/]/g.test(key))
    onOperator(key);
  else if (key == "Enter") 
    onEquals();
});

// Must use keydown event for backspace.
document.addEventListener("keydown", (e) => {
  if (e.key == "Backspace")
    clearEntry();
});

function addChar(char) {
  const text = screen.innerText;
  const concat = text + char

  let finalText;

  if (char == "." && text.includes("."))
    return;
  if (firstCharOfStageTwo) {
    finalText = char;
    firstCharOfStageTwo = false;
  } else if (char != ".") {
    const formattedString = removeHeadZeroAppendChar(concat);
    finalText = formattedString.length < 16 ? formattedString : text;
  } else {
    finalText = concat.length < 16 ? concat : text;
  }
  screen.innerText = finalText;
}

function onOperator(op) {
  if (stage == 1) {
    firstNumber = screen.innerText;
    operator = op;
    stage = 2;
  } else if (stage == 2)  {
    secondNumber = screen.innerText; 
    operator = op;
    result = operate(operator, firstNumber, secondNumber);
    screen.innerText = result
    firstNumber = result;
    secondNumber = null;
  }
  firstCharOfStageTwo = true;
}

function onEquals() {
  if (stage != 2)
    return;

  secondNumber = screen.innerText
  screen.innerText = operate(operator, firstNumber, secondNumber);

  cleanVariables();
}

function clearEntry() {
  screen.innerText = "0";
}

function clearAll() {
  clearEntry();
  cleanVariables();
}

function cleanVariables() {
  stage = 1;
  firstNumber = null;
  operator = null;
  secondNumber = null;
}

function plusMinus() {
  const text = screen.innerText;
  if (text[0] == "-") {
    screen.innerText = text.substring(1);
  } else {
    screen.innerText = "-" + text;
  }
}

function operate(op, a, b) {
  a = +a;
  b = +b;
  switch (op) {
    case "+":
      return calculator.add(a, b);
    case "-":
      return calculator.subtract(a, b);
    case "*":
      return calculator.multiply(a, b);
    case "/":
      return calculator.divide(a, b);
    default:
      throw new Error(`Operator: ${op} not found.`);
  }
}

function removeHeadZeroAppendChar(text) {
  if (text[0] == "0" && text[1] != ".")
    return text.substring(1);
  
  return text;
}
