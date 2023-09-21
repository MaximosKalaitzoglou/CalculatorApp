import { Component, Input } from '@angular/core';
import { CalculatorDisplayService } from '../../calculatorDisplay.service';

@Component({
  selector: 'app-calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.css'],
})
export class CalculatorButtonComponent {
  @Input() value: string = '';
  isSpecial: boolean = false;
  constructor(private calcDispService: CalculatorDisplayService) {}

  onHandleButtonClick() {
    console.log(this.value);
    this.calcDispService.updateDisplay(this.value);
  }

  checkIfSpecial(value: string) {
    if (isNaN(parseFloat(value))) {
      return true;
    } else {
      return false;
    }
  }
}
