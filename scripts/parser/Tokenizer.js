export default class Tokenizer {
  static tokenize(exp) {
    const process = new Tokenizer(exp);
    
    while (process.hasCharsLeft) {
      if (process.charIsNumeric && !process.charIsBinaryMinus) {
        // If char is digit, '.' or unary minus: form number token
        let number = process.char;
        let hasDecimalPoint = process.char === '.' ? true : false;
        process.next();

        while (process.charIsDigit || (process.char === '.' && !hasDecimalPoint)) {
          if (process.char === '.') hasDecimalPoint = true;

          number += process.char;
          process.next();
        }

        process.addToken('NUM', number);
      } else if (process.charIsOperator) {
        process.addToken('OP', process.char);
        process.next();
      } else if (process.char === '(') {
        process.addToken('LPAR', '(');
        process.next();
      } else if (process.char === ')') {
        process.addToken('RPAR', ')');
        process.next();
      } else {
        process.next();
      }
    }

    // Generate refined version of the tokens before returning them:

    function* refine(tokens) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === 'NUM') {
          if (token.value.startsWith(".") || token.value.startsWith("-.")) {
            token.value = token.value.replace('.', "0.");
          }
        } else if (token.value === '(' && tokens[i - 1] && tokens[i - 1].type !== 'OP') {
          yield { type: 'OP', value: '*' }
        } else if (token.value === ')' && tokens[i + 1] && tokens[i + 1].type !== 'OP') {
          yield token;
          yield { type: 'OP', value: '*' }
          continue;
        }

        yield token;
      };
    }

    const tokens = [];
    const refiner = refine(process.tokens);

    let next = refiner.next();
    while (!next.done) {
      tokens.push(next.value);
      next = refiner.next();
    }

    return tokens;
  }

  constructor(exp) {
    if (typeof exp !== 'string') {
      return new SyntaxError("Expressions has to be string type");
    }

    this.input = exp.replace(/\s+/g, '');
    this.charIndex = 0;
    this.tokens = [];
  }

  get char() {
    return this.input[this.charIndex];
  }

  get charIsNumeric() {
    return /[\-\d.]/.test(this.char);
  }

  get charIsDigit() {
    return /\d/.test(this.char);
  }

  get charIsOperator() {
    return /[+\-*/]/.test(this.char);
  }

  get charIsBinaryMinus() {
    if (this.char !== '-') return false;
    if (/\d/.test(this.peek(-1)) || this.peek(-1) === '.') return true;
    if (/\d/.test(this.peek(1)) || this.peek(1) === '.') return false;
    return true;
  }

  get hasCharsLeft() {
    return this.charIndex < this.input.length;
  }

  peek(relativeCharIndex) {
    return this.input[this.charIndex + relativeCharIndex];
  }

  next() {
    this.charIndex++;
  }

  addToken(type, value) {
    this.tokens.push({type, value});
  }
}