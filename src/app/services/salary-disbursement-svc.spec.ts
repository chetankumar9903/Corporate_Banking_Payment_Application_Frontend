import { TestBed } from '@angular/core/testing';

import { SalaryDisbursementSvc } from './salary-disbursement-svc';

describe('SalaryDisbursementSvc', () => {
  let service: SalaryDisbursementSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryDisbursementSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
