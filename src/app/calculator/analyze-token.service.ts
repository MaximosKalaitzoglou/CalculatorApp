import { Injectable } from '@angular/core';

const operators = ['+', '-', '×', '÷'];
const functions = ['Log', 'ln', 'sin', 'cos', 'tan', '√'];
const specials = ['%', '!'];
const e = 2.71828182845904523536028747;
const pi = 3.1415926535897932384626433;

@Injectable()
export class AnalyzeTokenService {
  constants: { [id: string]: number } = { e: e, π: pi };
  constructor() {}

  isOperator(token: string): boolean {
    return operators.includes(token);
  }

  isFunction(token: string): boolean {
    return functions.includes(token);
  }

  isSpecial(token: string): boolean {
    return specials.includes(token);
  }

  isConstant(token: string): boolean {
    return Object.keys(this.constants).includes(token);
  }
}
