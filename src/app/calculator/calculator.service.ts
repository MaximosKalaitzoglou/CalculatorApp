import { EventEmitter } from '@angular/core';

export class CalculatorService {
  display: string = '0';

  displayWasUpdated = new EventEmitter<void>();

  getDisplay() {
    return this.display.slice();
  }

  updateDisplay(value: string) {
    this.display += value;
    this.displayWasUpdated.emit();
  }
}
