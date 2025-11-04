import { TestBed } from '@angular/core/testing';

import { CustomerSvc } from './customer-svc';

describe('CustomerSvc', () => {
  let service: CustomerSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
