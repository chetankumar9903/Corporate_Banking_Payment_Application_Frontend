import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salarylist } from './salarylist';

describe('Salarylist', () => {
  let component: Salarylist;
  let fixture: ComponentFixture<Salarylist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salarylist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salarylist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
