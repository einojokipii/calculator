export default class Stack {
  constructor() {
    this.stack = [];
  }

  push(item) {
    this.stack.push(item);
  }

  pop() {
    return this.stack.pop();
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  get isEmpty() {
    return this.stack.length < 1;
  }
}