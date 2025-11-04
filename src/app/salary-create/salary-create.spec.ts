import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryCreate } from './salary-create';

describe('SalaryCreate', () => {
  let component: SalaryCreate;
  let fixture: ComponentFixture<SalaryCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
