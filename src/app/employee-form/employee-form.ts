import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../models/Employee';
import { EmployeeSvc } from '../services/employee-svc';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  employeeForm!: FormGroup;
  employeeId?: number;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeSvc,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.employeeId;

    this.employeeForm = this.fb.group({
      
      firstName: ['', Validators.required],
      lastName: [''],
      emailId: ['', [Validators.required, Validators.email]],
       phoneNumber: ['', [
    Validators.required,
    Validators.pattern(/^\d{10}$/)  // exactly 10 digits
  ]],
      position: [''],
      department: [''],
      salary: [0, Validators.required],
      isActive: [true]
    });

    if (this.isEditMode) this.loadEmployee();
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (emp) => this.employeeForm.patchValue(emp),
      error: (err) => console.error(err)
    });
  }

  submit(): void {
    if (this.employeeForm.invalid) return;
    this.loading = true;

    const formValue = this.employeeForm.value;

    if (this.isEditMode) {
      const dto: UpdateEmployeeDto = formValue;
      this.employeeService.updateEmployee(this.employeeId!, dto).subscribe({
        next: () => this.router.navigate(['/client-dashboard/employees']),
        error: (err) => { console.error(err); this.loading = false; }
      });
    } else {
      const dto: CreateEmployeeDto = { ...formValue, clientId: Number(localStorage.getItem('clientId')) };
 this.employeeService.createEmployee(dto).subscribe({
      next: () => this.router.navigate(['/client-dashboard/employees']),
      error: (err) => { 
        console.error('Create Employee failed', err); 
        alert(err.error?.message || 'Failed to create employee'); 
        this.loading = false; 
      }
    });
    }
  }

}
