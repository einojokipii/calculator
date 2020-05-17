import { evaluate } from './parser/parse.js';

const display = document.querySelector(".calculator .display");
const keypad = document.querySelector(".calculator .keypad");

const expression = {
  value: "",

  clearAll() {
    this.value = "";
  },
  clearEntry() {
    this.value = this.value.slice(0, -1).trim();
  },
  addDigit(digit) {
    this.value += digit;
  },
  addDot() {
    this.value += '.';
  },
  addOperator(op) {
    this.value += op;
  },
  addLeftPar() {
    this.value += '(';
  },
  addRightPar() {
    this.value += ')';
  },

  get isEmpty() {
    return this.value.length < 1;
  }
};

keypad.addEventListener("mousedown", e => {
  if (!e.target.dataset.key) return;
  handleKeyPress(e.target.dataset.key);
});

document.addEventListener("keydown", e => {
  switch (e.key.toLowerCase()) {
    case 'c': handleKeyPress('AC'); break;
    case 'backspace': handleKeyPress('CE'); break;
    case 'enter': handleKeyPress('='); break;
    default: handleKeyPress(e.key);
  }
})

function handleKeyPress(key) {
  if (key === 'AC') {
    expression.clearAll();
  } else if (key === 'CE') {
    expression.clearEntry();
  } else if (/\d/.test(key)) {
    expression.addDigit(key);
  } else if (key === '.') {
    expression.addDot();
  } else if (/[+\-*/]/.test(key)) {
    expression.addOperator(key);
  } else if (key === '(') {
    expression.addLeftPar();
  } else if (key === ')') {
    expression.addRightPar();
  } else if (key === '=') {
    expression.value = evaluate(expression.value).toString();
  } else {
    return;
  }

  // Update/render display
  if (expression.isEmpty) {
    display.textContent = "0";
  } else {
    // Convert expression operators '-', '*' and '/' to '−', '×' and '÷' display symbols.
    display.textContent = expression.value.split('').map(char => {
      switch (char) {
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return char;
      }
    }).join('');
  }
}
