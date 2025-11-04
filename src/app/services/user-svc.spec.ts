import { TestBed } from '@angular/core/testing';

import { UserSvc } from './user-svc';

describe('UserSvc', () => {
  let service: UserSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
