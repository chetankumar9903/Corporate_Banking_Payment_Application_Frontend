import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGenerate } from './report-generate';

describe('ReportGenerate', () => {
  let component: ReportGenerate;
  let fixture: ComponentFixture<ReportGenerate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportGenerate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportGenerate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
