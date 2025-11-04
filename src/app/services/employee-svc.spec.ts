import { TestBed } from '@angular/core/testing';

import { EmployeeSvc } from './employee-svc';

describe('EmployeeSvc', () => {
  let service: EmployeeSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
