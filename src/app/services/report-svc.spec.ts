import { TestBed } from '@angular/core/testing';

import { ReportSvc } from './report-svc';

describe('ReportSvc', () => {
  let service: ReportSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
