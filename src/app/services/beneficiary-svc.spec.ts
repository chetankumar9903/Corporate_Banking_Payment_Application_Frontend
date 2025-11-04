import { TestBed } from '@angular/core/testing';

import { BeneficiarySvc } from './beneficiary-svc';

describe('BeneficiarySvc', () => {
  let service: BeneficiarySvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiarySvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
