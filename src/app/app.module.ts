import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { CalculatorButtonComponent } from './calculator/calculator-button-group/calculator-button/calculator-button.component';
import { CalculatorDisplayService } from './calculator/calculatorDisplay.service';
import { CalculatorButtonGroupComponent } from './calculator/calculator-button-group/calculator-button-group.component';
import { CalculateOutputService } from './calculator/calculate-output.service';
import { AnalyzeTokenService } from './calculator/analyze-token.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalculatorComponent,
    CalculatorButtonComponent,
    CalculatorButtonGroupComponent,
  ],
  imports: [BrowserModule],
  providers: [
    CalculatorDisplayService,
    CalculateOutputService,
    AnalyzeTokenService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
