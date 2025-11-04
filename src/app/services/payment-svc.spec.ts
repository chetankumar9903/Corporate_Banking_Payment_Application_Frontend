import { TestBed } from '@angular/core/testing';

import { PaymentSvc } from './payment-svc';

describe('PaymentSvc', () => {
  let service: PaymentSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
