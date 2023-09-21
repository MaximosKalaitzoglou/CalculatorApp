import { Component, Input } from '@angular/core';
import { CalculatorService } from '../../calculator.service';

@Component({
  selector: 'app-calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.css'],
})
export class CalculatorButtonComponent {
  @Input() value: string = '';
  isSpecial: boolean = false;
  constructor(private calcService: CalculatorService) {}

  onHandleButtonClick() {
    console.log(this.value);
    this.calcService.updateDisplay(this.value);
  }

  checkIfSpecial(value: string) {

    if (isNaN(parseFloat(value))) {
      return true;
    } else {
      return false;
    }
  }
}
