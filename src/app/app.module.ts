import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { CalculatorButtonComponent } from './calculator/calculator-button-group/calculator-button/calculator-button.component';
import { CalculatorService } from './calculator/calculator.service';
import { CalculatorButtonGroupComponent } from './calculator/calculator-button-group/calculator-button-group.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalculatorComponent,
    CalculatorButtonComponent,
    CalculatorButtonGroupComponent,
  ],
  imports: [BrowserModule],
  providers: [CalculatorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
