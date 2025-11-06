import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminReports } from './superadmin-reports';

describe('SuperadminReports', () => {
  let component: SuperadminReports;
  let fixture: ComponentFixture<SuperadminReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
