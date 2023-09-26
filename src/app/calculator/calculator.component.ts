import { Component, OnInit } from '@angular/core';
import { CalculatorDisplayService } from './calculatorDisplay.service';
import { CalculatorButtonList } from './calculator-button-list';
import { CustomError } from '../custom-error.model';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  value: string = '';
  error: CustomError = new CustomError();
  exponentPower: string = '';

  buttonList: string[][] = new CalculatorButtonList().getButtons();
  constructor(private calcDispServ: CalculatorDisplayService) {}

  ngOnInit(): void {
    this.value = this.calcDispServ.getDisplay();
    this.calcDispServ.displayWasUpdated.subscribe((error: CustomError) => {
      this.value = this.calcDispServ.getDisplay();
      this.error = error;
    });
  }

  formatExpression(expression: string): string {
    const formattedExpression = expression.replace(
      /(\d+|e|π) \^ (\d+)/g,
      (match, base, exponent) => {
        return `${base}<sup>${exponent}</sup>`;
      }
    );

    const formattedSpecials = formattedExpression.replace(
      /(\d+)\s*([!%])?\s*\^\s*(\d+)/g,
      (match, base, special, exponent) => {
        return `${base}${special}<sup>${exponent}</sup>`;
      }
    );

    const formattedFunctions = formattedSpecials.replace(
      /(\w+)\s*\((.*?)\)\s*\^\s*(\d+)/g,
      (match, funcName, funcArgs, exponent) => {
        return `${funcName}(${funcArgs})<sup>${exponent}</sup>`;
      }
    );

    return formattedFunctions;
  }
}
