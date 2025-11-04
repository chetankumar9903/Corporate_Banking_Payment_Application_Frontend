import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalarySvc } from '../services/salary-svc';
import { LoginSvc } from '../services/login-svc';
import { EmployeeSvc } from '../services/employee-svc';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-salary-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './salary-create.html',
  styleUrl: './salary-create.css',
})
export class SalaryCreate implements OnInit {
  form: FormGroup;
  employees: any[] = [];
  submitting = false;
  message = '';
  clientId: number | null = null;
  selectedEmployee: any = null;
  allowCustom = false;

  constructor(private svc: SalarySvc, private login: LoginSvc, private empSvc: EmployeeSvc, private router: Router) {
    this.clientId = this.login.getClientId();
    this.form = new FormGroup({
      employeeId: new FormControl(null, Validators.required),
      amount: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.min(1)]),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    // load only employees of this client
    if (!this.clientId) return;
    this.empSvc.getByClientId(this.clientId).subscribe({
      next: (res) => this.employees = res,
      error: () => console.error('failed to load employees')
    });
  }

  submit() {
    if (!this.form.valid || !this.clientId) return;
    if (!confirm('Confirm disburse salary to employee?')) return;

    this.submitting = true;
    const dto = {
      clientId: this.clientId,
      employeeId: this.form.value.employeeId,
      amount: this.form.value.amount,
      description: this.form.value.description || 'Bonus'
    };
    // this.svc.create(dto).subscribe({
    //   next: () => { this.message = 'Paid successfully'; this.submitting = false; this.router.navigate(['/client-dashboard/salaries']); },
    //   error: (err) => { this.message = err.error?.message || 'Failed'; this.submitting = false; }
    // });

     this.svc.create(dto).subscribe({
      next: () => {
        this.message = 'Paid successfully';
        this.submitting = false;
        this.form.reset();
        this.selectedEmployee = null;
        this.router.navigate(['/client-dashboard/salaries']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed';
        this.submitting = false;
      }
    });
  }

   onEmployeeSelect(event: any) {
    const id = Number(event.target.value);
    this.selectedEmployee = this.employees.find(e => e.employeeId === id);
    if (this.selectedEmployee) {
      this.form.patchValue({ amount: this.selectedEmployee.salary });
    }
  }
  cancel() { this.router.navigate(['/client-dashboard/salaries']); }

}
