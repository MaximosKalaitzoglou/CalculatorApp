export class CalculatorButtonList {
  calcButtons: string[][] = [
    ['TBD', '!', '%', '(', ')', 'CE', 'C'],
    ['sin', 'ln', '√', '7', '8', '9', '×'],
    ['π', 'cos', 'Log', '4', '5', '6', '÷'],
    ['TBD', 'tan', 'e', '1', '2', '3', '-'],
    ['TBD', 'TBD', 'x', '0', '.', '=', '+'],
  ];

  getButtons() {
    console.log(this.calcButtons);
    return this.calcButtons;
  }
}
