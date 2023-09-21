import { EventEmitter, Injectable } from '@angular/core';
import { AnalyzeTokenService } from './analyze-token.service';
import { CalculateOutputService } from './calculate-output.service';

@Injectable()
export class CalculatorDisplayService {
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
  error: { invalid: boolean; message: string } = {
    invalid: false,
    message: '',
  };

  displayWasUpdated = new EventEmitter<{ invalid: boolean; message: string }>();

  constructor(
    private analyzer: AnalyzeTokenService,
    private calculate: CalculateOutputService
  ) {}

  getDisplay() {
    return this.display.slice();
  }

  determineStates(value: string) {
    if (this.analyzer.isOperator(value)) {
      this.state = 'operator';
    } else if (value === '=') {
      this.state = 'equals';
    } else if (value === 'C') {
      this.state = 'C';
    } else if (value === 'CE') {
      this.state = 'CE';
    } else if (this.analyzer.isFunction(value)) {
      this.state = 'function';
    } else if (value === '(') {
      this.state = 'parenthesis-open';
    } else if (value === ')') {
      this.state = 'parenthesis-close';
    } else if (this.analyzer.isSpecial(value)) {
      this.state = 'special';
    } else if (this.analyzer.isConstant(value)) {
      this.state = 'constant';
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

  calculateOutput() {
    this.display = this.calculate.calculate(this.display);
  }

  updateDisplay(value: string) {
    // console.log(value);
    this.error.invalid = false;
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
          this.error.invalid = true;
          this.error.message = 'Parenthesis not closed!';
        } else {
          this.calculateOutput();
          this.state = 'digit';
        }

        break;
      case 'parenthesis-open':
        if (prevState === 'digit') {
          this.operatorState('×');
        }
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
          this.error.invalid = true;
          this.error.message = 'Cannot cast ' + value + ' on (';

          this.state = prevState;
          break;
        }
        this.specialState(value);
        break;
      case 'constant':
        if (prevState === 'digit' || prevState === 'constant') {
          this.operatorState('×');
        }
        this.digitState(value);
        break;
    }

    this.displayWasUpdated.emit(this.error);
  }

  digitState(value: string) {
    if (this.display.length < 2 && this.display[0] === '0') {
      this.display = value;
    } else {
      this.display += value;
    }
  }

  operatorState(value: string) {
    if (this.analyzer.isOperator(this.display[this.display.length - 2])) {
      this.display = this.display.slice(0, -3);
    }
    this.display += ' ' + value + ' ';
    // console.log(this.display);
  }

  functionState(value: string) {
    const tokens = this.display.split(' ');
    // console.log(tokens);
    if (this.analyzer.isFunction(tokens[tokens.length - 2])) {
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
