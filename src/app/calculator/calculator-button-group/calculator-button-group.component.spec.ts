import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorButtonGroupComponent } from './calculator-button-group.component';

describe('CalculatorButtonGroupComponent', () => {
  let component: CalculatorButtonGroupComponent;
  let fixture: ComponentFixture<CalculatorButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorButtonGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
