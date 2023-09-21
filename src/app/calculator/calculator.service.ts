import { EventEmitter } from '@angular/core';

const operators = ['+', '-', '×', '÷'];
const functions = ['Log', 'ln', 'sin', 'cos', '!', 'tan', '√', '%'];

export class CalculatorService {
  /* display is updated by user input and returned to update the
  current display

  parenthesis is used to count the number of open parenthesis (

  state is used to know the current input state

  result is the output of the calculator when the "=" sign is pressed

  */
  display: string = '0';
  parenthesis: number = 0;
  state: string = 'digit';
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
    } else {
      // if (this.isFunction(value.slice(0, -2))) {
      //   this.state = 'function';
      //   return;
      // }
      this.state = 'digit';
    }
  }

  updateDisplay(value: string) {
    console.log(value);
    const prevState = this.state;
    this.determineStates(value);

    switch (this.state) {
      case 'operator':
        break;
      case 'digit':
        this.digitState(value);
        break;
      case 'function':
        break;
      case 'CE':
        break;
      case 'C':
        this.display = '0';
        break;
      case 'equals':
        break;
      case 'parenthesis-open':
        break;
      case 'parenthesis-close':
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
}
