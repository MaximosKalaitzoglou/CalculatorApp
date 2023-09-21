import { Component, OnInit } from '@angular/core';
import { CalculatorDisplayService } from './calculatorDisplay.service';
import { CalculatorButtonList } from './calculator-button-list';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  value: string = '';
  error: { invalid: boolean; message: string } = {
    invalid: false,
    message: '',
  };

  buttonList: string[][] = new CalculatorButtonList().getButtons();
  constructor(private calcDispServ: CalculatorDisplayService) {}

  ngOnInit(): void {
    this.value = this.calcDispServ.getDisplay();
    this.calcDispServ.displayWasUpdated.subscribe(
      (error: { invalid: boolean; message: string }) => {
        this.value = this.calcDispServ.getDisplay();
        this.error = error;
      }
    );
  }
}
