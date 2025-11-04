import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalarySvc } from '../services/salary-svc';
import { LoginSvc } from '../services/login-svc';
import { EmployeeSvc } from '../services/employee-svc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './batch-create.html',
  styleUrl: './batch-create.css',
})
export class BatchCreate implements OnInit {
  form: FormGroup;
  employees: any[] = [];
  selected: number[] = [];
  clientId: number | null;
  submitting = false;
  message = '';

  constructor(private svc: SalarySvc, private login: LoginSvc, private empSvc: EmployeeSvc, private router: Router) {
    this.clientId = this.login.getClientId();
    this.form = new FormGroup({
      totalAmount: new FormControl({ value: 0, disabled: true }, Validators.required),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (!this.clientId) return;
    this.empSvc.getByClientId(this.clientId).subscribe({ next: res => this.employees = res, error: () => {} });
  }

  onToggle(employeeId: number, checked: boolean) {
    if (checked) this.selected.push(employeeId); else this.selected = this.selected.filter(id => id !== employeeId);
    const total = this.calculateTotal();
    this.form.get('totalAmount')!.setValue(total);
  }

  calculateTotal() {
    // If employee salary available use it, otherwise 0
    return this.employees
      .filter(e => this.selected.includes(e.employeeId))
      .reduce((sum, e) => sum + (Number(e.salary || 0)), 0);
  }

  submit() {
    if (!this.clientId || this.selected.length === 0) return;
    if (!confirm(`Create batch for ${this.selected.length} employees?`)) return;

    this.submitting = true;
    const dto = {
      clientId: this.clientId,
      employeeIds: this.selected,
      totalAmount: Number(this.form.get('totalAmount')!.value),
      description: this.form.get('description')!.value || undefined
    };
    // this.svc.createBatch(dto).subscribe({
    //   next: () => { this.message = 'Batch created'; this.submitting = false; this.router.navigate(['/client/salaries']); },
    //   error: (err) => { this.message = err.error?.message || 'Failed'; this.submitting = false; }
    // });

     this.svc.createBatch(dto).subscribe({
    next: () => {
      this.message = '✅ Batch created successfully!';
      this.submitting = false;

      // Reset the form and selections
      this.form.reset({ totalAmount: 0, description: '' });
      this.selected = [];

      // Optional: uncheck all checkboxes visually
      this.employees = this.employees.map(e => ({ ...e, checked: false }));

      // Redirect after short delay (for success message)
      setTimeout(() => this.router.navigate(['/client-dashboard/salaries']), 1000);
    },
    error: (err) => {
      this.message = err.error?.message || '❌ Failed to create batch';
      this.submitting = false;
    }
  });
  }

  cancel() { this.router.navigate(['/client-dashboard/salaries']); }

}
