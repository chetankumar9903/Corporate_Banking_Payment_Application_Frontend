import { TestBed } from '@angular/core/testing';

import { LoginSvc } from './login-svc';

describe('LoginSvc', () => {
  let service: LoginSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
