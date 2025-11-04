import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientForm } from './create-client-form';

describe('CreateClientForm', () => {
  let component: CreateClientForm;
  let fixture: ComponentFixture<CreateClientForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClientForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
