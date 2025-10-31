import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDashboard } from './bank-dashboard';

describe('BankDashboard', () => {
  let component: BankDashboard;
  let fixture: ComponentFixture<BankDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
