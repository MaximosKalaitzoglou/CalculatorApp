import { EventEmitter } from '@angular/core';

const operators = ['+', '-', '×', '÷'];
const functions = ['Log', 'ln', 'sin', 'cos', 'tan', '√'];
const specials = ['%', '!'];
export class CalculatorService {
  /* display is updated by user input and returned to update the
  current display

  parenthesis is used to count the number of open parenthesis (

  state is used to know the current input state

  result is the output of the calculator when the "=" sign is pressed

  */
  display: string = '0';
  parenthesis: number = 0;
  state: string = '';
  result: number = 0;

  displayWasUpdated = new EventEmitter<void>();

  getDisplay() {
    return this.display.slice();
  }

  isOperator(token: string): boolean {
    return operators.includes(token);
  }

  isFunction(token: string): boolean {
    return functions.includes(token);
  }

  isSpecial(token: string): boolean {
    return specials.includes(token);
  }

  determineStates(value: string) {
    if (this.isOperator(value)) {
      this.state = 'operator';
    } else if (value === '=') {
      this.state = 'equals';
    } else if (value === 'C') {
      this.state = 'C';
    } else if (value === 'CE') {
      this.state = 'CE';
    } else if (this.isFunction(value)) {
      this.state = 'function';
    } else if (value === '(') {
      this.state = 'parenthesis-open';
    } else if (value === ')') {
      this.state = 'parenthesis-close';
    } else if (this.isSpecial(value)) {
      this.state = 'special';
    } else {
      this.state = 'digit';
    }
  }

  backspace(state: string) {
    console.log('Entered state: ' + state);

    if (state === 'digit') {
      this.display = this.display.slice(0, -1);
    } else if (state === 'operator') {
      this.display = this.display.slice(0, -1);
    } else if (state === 'function') {
      const tokens = this.display.split(' ');
      console.log(tokens);
      let size = tokens[tokens.length - 1].length + 1;
      this.display = this.display.slice(0, -size);
    } else if (state === 'parenthesis-open' || state === 'parenthesis-close') {
      this.display = this.display.slice(0, -3);
    }

    if (this.display.length < 1) {
      this.display = '0';
    }

    let tokens = this.display.split(' ');
    if (tokens[tokens.length - 1] === '') {
      tokens = tokens.slice(0, -1);
      this.display = this.display.slice(0, -1);
    }
    console.log(tokens);
    this.determineStates(tokens[tokens.length - 1]);
    console.log('Exit state: ' + this.state);
  }

  updateDisplay(value: string) {
    console.log(value);
    const prevState = this.state;
    this.determineStates(value);

    switch (this.state) {
      case 'operator':
        this.operatorState(value);
        break;
      case 'digit':
        if (prevState === 'special') {
          this.operatorState('×');
        }
        this.digitState(value);
        break;
      case 'function':
        if (prevState === 'digit') {
          this.operatorState('×');
        }
        this.functionState(value);
        break;
      case 'CE':
        this.backspace(prevState);
        break;
      case 'C':
        this.display = '0';
        break;
      case 'equals':
        if (this.parenthesis > 0) {
          alert('Parenthesis is not closed!!');
        } else {
        }
        break;
      case 'parenthesis-open':
        this.setParenthesis(value);
        this.parenthesis++;
        console.log(this.parenthesis);

        break;
      case 'parenthesis-close':
        this.setParenthesis(value);
        this.parenthesis = this.parenthesis > 0 ? --this.parenthesis : 0;
        console.log(this.parenthesis);

        break;
      case 'special':
        if (prevState === 'parenthesis-open') {
          console.log('Action not allowed!');
          this.state = prevState;
          break;
        }
        this.specialState(value);
        break;
    }

    this.displayWasUpdated.emit();
  }

  digitState(value: string) {
    if (this.display.length < 2 && this.display[0] === '0') {
      this.display = value;
    } else {
      this.display += value;
    }
  }

  operatorState(value: string) {
    if (this.isOperator(this.display[this.display.length - 2])) {
      this.display = this.display.slice(0, -3);
    }
    this.display += ' ' + value + ' ';
    // console.log(this.display);
  }

  functionState(value: string) {
    const tokens = this.display.split(' ');
    // console.log(tokens);
    if (this.isFunction(tokens[tokens.length - 2])) {
      this.display = this.display.slice(
        0,
        -tokens[tokens.length - 2].length - 2
      );

      this.backspace(this.state);
    }
    if (tokens.length < 2 && tokens[0] === '0') {
      this.display = value + ' ';
    } else {
      this.display += ' ' + value + ' ';
    }
    this.updateDisplay('(');
  }

  specialState(value: string) {
    this.display += ' ' + value;
  }

  setParenthesis(value: string) {
    if (value === ')' && this.parenthesis < 1) {
      return;
    }

    this.display += ' ' + value + ' ';
  }
}
