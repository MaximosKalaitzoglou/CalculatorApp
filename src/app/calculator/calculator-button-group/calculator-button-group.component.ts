import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calculator-button-group',
  templateUrl: './calculator-button-group.component.html',
  styleUrls: ['./calculator-button-group.component.css'],
})
export class CalculatorButtonGroupComponent {
  @Input() buttonList: string[] = [];
}
