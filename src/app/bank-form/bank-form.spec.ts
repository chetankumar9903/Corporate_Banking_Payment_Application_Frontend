import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankForm } from './bank-form';

describe('BankForm', () => {
  let component: BankForm;
  let fixture: ComponentFixture<BankForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
