import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { CalculatorButtonComponent } from './calculator/calculator-button/calculator-button.component';
import { CalculatorService } from './calculator/calculator.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalculatorComponent,
    CalculatorButtonComponent,
  ],
  imports: [BrowserModule],
  providers: [CalculatorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
