import { TestBed } from '@angular/core/testing';

import { RegisterSvc } from './register-svc';

describe('RegisterSvc', () => {
  let service: RegisterSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
