import { TestBed } from '@angular/core/testing';

import { ClientSvc } from './client-svc';

describe('ClientSvc', () => {
  let service: ClientSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
