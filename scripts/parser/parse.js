import Tokenizer from './Tokenizer.js';
import Stack from './Stack.js';

export function evaluate(exp) {
  const tokens = Tokenizer.tokenize(exp);
  const postfix = infixToPostfix(tokens);
  console.log(tokens, postfix);
  return evaluatePostfix(postfix);
}

function precedence(op) {
  switch (op) {
    case '*': return 2;
    case '/': return 2;
    case '+': return 1;
    case '-': return 1;
    default: return 0;
  }
}

function add(num1 = 0, num2 = 0) {
  return parseFloat(num1) + parseFloat(num2);
}

function subtract(num1 = 0, num2 = 0) {
  return parseFloat(num1) - parseFloat(num2);
}

function multiply(num1, num2 = 1) {
  return parseFloat(num1) * parseFloat(num2);
}

function divide(num1, num2 = 1) {
  return parseFloat(num1) / parseFloat(num2);
}

function infixToPostfix(tokens) {
  const infix = [...tokens];
  const stack = new Stack();
  const postfix = [];

  for (const token of infix) {
    if (token.type === 'NUM') {
      postfix.push(token);
    } else if (token.type === 'OP') {
      if (stack.isEmpty || precedence(token.value) > precedence(stack.top.value)) {
        stack.push(token);
      } else {
        while (!stack.isEmpty && precedence(stack.top.value) >= precedence(token.value)) {
          postfix.push(stack.pop());
        }

        stack.push(token);
      }
    } else if (token.value === '(') {
      stack.push(token);
    } else if (token.value === ')') {
      while (!stack.isEmpty && stack.top.value !== '(') {
        postfix.push(stack.pop());
      }

      if (!stack.isEmpty && stack.top.value === '(') {
        stack.pop();
      }
    } else {
      continue;
    }
  }

  while (!stack.isEmpty) {
    postfix.push(stack.pop());
  }

  return postfix;
}

function evaluatePostfix(tokens) {
  const postfix = [...tokens];
  const stack = new Stack();

  for (const token of postfix) {
    if (token.type === 'NUM') {
      stack.push(token.value);
    } else {
      const num1 = stack.pop();
      const num2 = stack.pop();

      switch(token.value) {
        case '+': stack.push(add(num2, num1)); break;
        case '-': stack.push(subtract(num2, num1)); break;
        case '*': stack.push(multiply(num2, num1)); break;
        case '/': stack.push(divide(num2, num1)); break;
      }
    }
  }

  if (Number.isNaN(stack.top)) {
    return "Error!";
  }

  return stack.pop();
}

