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

  buttonList: string[][] = new CalculatorButtonList().getButtons();
  constructor(private calcDispServ: CalculatorDisplayService) {}

  ngOnInit(): void {
    this.value = this.calcDispServ.getDisplay();
    this.calcDispServ.displayWasUpdated.subscribe((error: CustomError) => {
      this.value = this.calcDispServ.getDisplay();
      this.error = error;
    });
  }
}
