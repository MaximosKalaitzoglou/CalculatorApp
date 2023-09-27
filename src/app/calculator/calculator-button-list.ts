export class CalculatorButtonList {
  calcButtons: string[][] = [
    ['TBD', '!', '%', '(', ')', 'CE', 'C'],
    ['sin', 'ln', '√', '7', '8', '9', '×'],
    ['π', 'cos', 'Log', '4', '5', '6', '÷'],
    ['Rng', 'tan', 'e', '1', '2', '3', '-'],
    ['Ans', 'TBD', 'x', '0', '.', '=', '+'],
  ];

  getButtons() {
    // console.log(this.calcButtons);
    return this.calcButtons;
  }
}
