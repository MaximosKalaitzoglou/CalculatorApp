import { Injectable } from '@angular/core';
import { AnalyzeTokenService } from './analyze-token.service';
import { CalculateOutputService } from './calculate-output.service';
import { CustomError } from '../custom-error.model';
import { Subject } from 'rxjs';

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
  state: string = 'start';
  isDecimal: boolean = false;
  result: number = 0;
  error: CustomError = new CustomError();
  answerSnapshot: number = 0;
  displayWasUpdated = new Subject<CustomError>();

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
    } else if (value === '.') {
      this.state = 'decimal';
    } else {
      this.state = 'digit';
    }
  }

  //TODO: Bug fixes for backspace not working correctly if overused
  // main problem the spaces between operators,digits, function
  backspace(state: string) {
    console.log('Entered state: ' + state);

    if (state === 'digit' || state === 'decimal' || state === 'constant') {
      this.display = this.display.slice(0, -1);
    } else if (state === 'operator') {
      this.display = this.display.slice(0, -1);
    } else if (state === 'function') {
      const tokens = this.display.split(' ');
      console.log(tokens);
      let size = tokens[tokens.length - 1].length + 1;
      this.display = this.display.slice(0, -size);
    } else if (state === 'parenthesis-open') {
      this.parenthesis--;
      this.display = this.display.slice(0, -3);
    } else if (state === 'parenthesis-close') {
      this.parenthesis++;
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

  getPrevAns() {
    return this.analyzer.constants['Ans'];
  }

  calculateOutput() {
    this.display = this.calculate.calculate(this.display);
    this.analyzer.constants['Ans'] = !isNaN(parseFloat(this.display))
      ? parseFloat(this.display)
      : 0;
  }

  //TODO: minus sign state since numbers can be -6 , -8
  // fractional sign . needs it's own state

  updateDisplay(value: string) {
    // console.log(value);
    this.error.invalid = false;
    const prevState = this.state;
    this.determineStates(value);
    if (this.analyzer.isNotADigit(value)) this.isDecimal = false;

    switch (this.state) {
      case 'operator':
        if (prevState === 'parenthesis-open') {
          if (value !== '-') {
            this.error.invalid = true;
            this.error.message =
              'Cannot cast operator after ( \n Only "-" sign allowed!';
          } else {
            this.digitState('0');
            this.operatorState(value);
          }
        } else {
          this.operatorState(value);
        }
        break;
      case 'digit':
        if (
          prevState === 'special' ||
          prevState === 'constant' ||
          prevState === 'parenthesis-close'
        ) {
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
        this.state = 'start';
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
        if (prevState === 'operator') {
          this.error.invalid = true;
          this.error.message =
            'Did you forget to add a number after operator ?';
          this.state = prevState;
          break;
        }
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
        if (value === 'Rng') this.digitState(this.calculate.getRandomNumber());
        else this.digitState(value);
        break;
      case 'decimal':
        if (this.isDecimal) {
          this.error.invalid = true;
          this.error.message = 'Cannot cast "." to an already decimal number';
          break;
        }
        if (
          prevState === 'special' ||
          prevState === 'parenthesis-close' ||
          prevState === 'constant'
        )
          this.operatorState('×');
        this.decimalState(value);
        break;
    }

    this.displayWasUpdated.next(this.error);
  }

  decimalState(value: string) {
    this.display += value;
    this.isDecimal = true;
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
