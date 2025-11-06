import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalarySvc } from '../services/salary-svc';
import { LoginSvc } from '../services/login-svc';
import { EmployeeSvc } from '../services/employee-svc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
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

  
  selectAll = false;
  selectedCsvFile: File | null = null;

onCsvSelected(event: any) {
  this.selectedCsvFile = event.target.files[0] ?? null;
}



  constructor(private svc: SalarySvc, private login: LoginSvc, private empSvc: EmployeeSvc, private router: Router) {
    this.clientId = this.login.getClientId();
    this.form = new FormGroup({
      totalAmount: new FormControl({ value: 0, disabled: true }, Validators.required),
      description: new FormControl('')
    });
  }

  // ngOnInit(): void {
  //   if (!this.clientId) return;
  //   this.empSvc.getByClientId(this.clientId).subscribe({ next: res => this.employees = res, error: () => {} });
  // }

  ngOnInit(): void {
  if (!this.clientId) return;
  this.empSvc.getByClientId(this.clientId).subscribe({
    // next: res => {
    //   this.employees = res.map(e => ({ ...e, checked: false }));
    // }
     next: res => {
      this.employees = res
        .filter(e => e.isActive)
        .map(e => ({ ...e, checked: false }));
    }
  });
}


  // onToggle(employeeId: number, checked: boolean) {
  //   if (checked) this.selected.push(employeeId); else this.selected = this.selected.filter(id => id !== employeeId);
  //   const total = this.calculateTotal();
  //   this.form.get('totalAmount')!.setValue(total);
  // }

  onToggle(employeeId: number, checked: boolean) {
  if (checked && !this.selected.includes(employeeId)) {
    this.selected.push(employeeId);
  } else if (!checked) {
    this.selected = this.selected.filter(id => id !== employeeId);
    this.selectAll = false; // if user unchecks anyone, remove "select all"
  }

  this.form.get('totalAmount')!.setValue(this.calculateTotal());
}
onToggleAll() {
  this.selected = [];

  this.employees = this.employees.map(e => {
    e.checked = this.selectAll; // set all checkboxes
    if (this.selectAll) this.selected.push(e.employeeId);
    return e;
  });

  this.form.get('totalAmount')!.setValue(this.calculateTotal());
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

//   uploadCsv(event: any) {
//   const file = event.target.files[0];
//   if (!file) return;

//   const form = new FormData();
//   form.append("file", file);

//   this.svc.uploadCsv(form, this.clientId!).subscribe({
//     next: res => alert(`✅ Created: ${res.created}, Skipped: ${res.skipped}`),
//     error: err => alert(err.error.message || "Error uploading CSV")
//   });
// }

// uploadCsv(event: any) {
//   const file = event.target.files[0];
//   if (!file) return;

//   const form = new FormData();
//   form.append("file", file);

//   this.svc.uploadCsv(form, this.clientId!).subscribe({
//   //   next: res => alert(`✅ Created: ${res.created}, Skipped: ${res.skipped}`),
//   //   error: err => alert(err.error.message || "Error uploading CSV")
//   // });

//    next: res => {
//       alert(`✅ Created: ${res.created}, Skipped: ${res.skipped}`);

//       // ✅ Redirect after success
//       this.router.navigate(['/client-dashboard/salaries']);
//     },
//     error: err => {
//       const msg = err?.error?.message || "Error uploading CSV";
//       alert("❌ " + msg);
//     }
//   });
// }


uploadSelectedCsv() {
  if (!this.selectedCsvFile) return;

  const form = new FormData();
  form.append("file", this.selectedCsvFile);

  this.svc.uploadCsv(form, this.clientId!).subscribe({
    next: res => {
      alert(`✅ Created: ${res.created}, Skipped: ${res.skipped}`);
      this.router.navigate(['/client-dashboard/salaries']); // redirect after success
    },
    error: err => {
      const msg = err?.error?.message || "❌ Error uploading CSV";
      alert(msg);
    }
  });
}

}
