import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVerification } from './customer-verification';

describe('CustomerVerification', () => {
  let component: CustomerVerification;
  let fixture: ComponentFixture<CustomerVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
