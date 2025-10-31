import { TestBed } from '@angular/core/testing';

import { BankSvc } from './bank-svc';

describe('BankSvc', () => {
  let service: BankSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
