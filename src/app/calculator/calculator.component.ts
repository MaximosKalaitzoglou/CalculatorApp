import { Component, OnInit } from '@angular/core';
import { CalculatorService } from './calculator.service';
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
  constructor(private calcServ: CalculatorService) {}

  ngOnInit(): void {
    this.value = this.calcServ.getDisplay();
    this.calcServ.displayWasUpdated.subscribe(
      (error: { invalid: boolean; message: string }) => {
        this.value = this.calcServ.getDisplay();
        this.error = error;
      }
    );
  }
}
