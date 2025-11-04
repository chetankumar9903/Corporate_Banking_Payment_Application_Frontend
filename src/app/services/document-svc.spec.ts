import { TestBed } from '@angular/core/testing';

import { DocumentSvc } from './document-svc';

describe('DocumentSvc', () => {
  let service: DocumentSvc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSvc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
