import { TestBed } from '@angular/core/testing';

import { SalarySvc } from './salary-svc';

describe('SalarySvc', () => {
  let service: SalarySvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarySvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
