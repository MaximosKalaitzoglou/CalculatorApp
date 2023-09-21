import { Injectable } from '@angular/core';
import { AnalyzeTokenService } from './analyze-token.service';

@Injectable()
export class CalculateOutputService {
  constructor(private analyzer: AnalyzeTokenService) {}

  getPriority(operator: string): number {
    if (operator === '+' || operator === '-') return 2;
    if (this.analyzer.isFunction(operator)) return 0;
    if (this.analyzer.isSpecial(operator)) return 0;
    if (operator === '×' || operator === '÷') return 1;

    return 0; // for other tokens like numbers
  }

  // Tokenizes the input string
  // then based on the priority of the operand it sorts the tokens (x, /, +, -) after the number pairs
  // so for ex. 9 x 3 + 2 -> [9,3,x,2,+] -> so the expression is then evaluated further
  // to 9 x 3 = [27,2,+] -> 27 + 2 = 29

  // TODO: "Parenthesis priority doesn't work it needs to be implemented!!"
  tokenizeAndPrioritizeOperants(expression: string): (number | string)[] {
    const output: (number | string)[] = [];
    const operatorStack: string[] = [];
    const tokens: string[] = expression.split(/\s+/);
    console.log(tokens);
    for (const token of tokens) {
      // console.log('Operator Stack: ' + operatorStack);
      // console.log('output: ' + output);
      if (!isNaN(parseFloat(token))) {
        output.push(parseFloat(token));
      } else if (this.analyzer.isConstant(token)) {
        output.push(this.analyzer.constants[token]);
      } else if (
        this.analyzer.isOperator(token) ||
        this.analyzer.isFunction(token)
      ) {
        while (
          operatorStack.length &&
          this.getPriority(operatorStack[operatorStack.length - 1]) <=
            this.getPriority(token)
        ) {
          output.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      }
    }

    while (operatorStack.length) {
      output.push(operatorStack.pop()!);
    }

    return output;
  }
  // TODO: factorial function needs to be implemented
  evaluateExpression(postExpression: (number | string)[]): number {
    const stack: number[] = [];
    for (const token of postExpression) {
      if (typeof token === 'number') {
        // If it's a number, push it onto the stack
        stack.push(token);
      } else if (this.analyzer.isOperator(token)) {
        const operand2 = stack.pop()!;
        const operand1 = stack.pop()!;
        // console.log(operand2, operand1);

        switch (token) {
          case '+':
            stack.push(operand1 + operand2);
            break;
          case '-':
            stack.push(operand1 - operand2);
            break;
          case '×':
            stack.push(operand1 * operand2);
            break;
          case '÷':
            stack.push(operand1 / operand2);
            break;
        }
        //functions basically work with 1 number so i only need to pop the number
        // and choose the function
      } else if (this.analyzer.isFunction(token)) {
        const operand2 = stack.pop()!;
        switch (token) {
          case 'Log':
            stack.push(Math.log10(operand2));
            break;
          case 'ln':
            stack.push(Math.log(operand2));
            break;

          case 'sin':
            stack.push(Math.sin(operand2));
            break;

          case 'cos':
            stack.push(Math.cos(operand2));
            break;

          case 'tan':
            stack.push(Math.tan(operand2));
            break;
          case '!':
            break;
          case '√':
            stack.push(Math.sqrt(operand2));
            break;

          case '%':
            stack.push(operand2 / 100);
            break;
        }
      }
    }

    // The final result will be the only value left on the stack
    return stack[0];
  }

  calculate(expression: string): string {
    const priorityOperations = this.tokenizeAndPrioritizeOperants(expression);
    console.log(priorityOperations);
    const result = this.evaluateExpression(priorityOperations);
    console.log(result);
    return result.toString();
  }
}
