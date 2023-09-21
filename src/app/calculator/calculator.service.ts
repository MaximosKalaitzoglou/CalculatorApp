import { EventEmitter } from '@angular/core';

const operators = ['+', '-', '×', '÷'];
const functions = ['Log', 'ln', 'sin', 'cos', '!', 'tan', '√', '%'];

export class CalculatorService {
  display: string = '0';
  parenthesis: number = 0;
  state: string = 'digit';
  invalid: boolean = false;
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

  updateDisplay(value: string) {
    this.determineStates(value);
    console.log(this.state);
    this.displayWasUpdated.emit();
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
}
