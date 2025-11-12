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



  ngOnInit(): void {
  if (!this.clientId) return;
  this.empSvc.getByClientId(this.clientId).subscribe({
   
     next: res => {
      this.employees = res
        .filter(e => e.isActive)
        .map(e => ({ ...e, checked: false }));
    }
  });
}


  onToggle(employeeId: number, checked: boolean) {
  if (checked && !this.selected.includes(employeeId)) {
    this.selected.push(employeeId);
  } else if (!checked) {
    this.selected = this.selected.filter(id => id !== employeeId);
    this.selectAll = false; 
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
 
     this.svc.createBatch(dto).subscribe({
    next: (res) => {
      this.message = 'Batch created successfully!';


      if (res.skippedAlreadyPaid?.length > 0) {
    this.message += `\n\nSkipped (already paid in last 30 days):\n- ${res.skippedAlreadyPaid.join("\n- ")}`;
  }

  alert(this.message);
      this.submitting = false;

      
      this.form.reset({ totalAmount: 0, description: '' });
      this.selected = [];

      
      this.employees = this.employees.map(e => ({ ...e, checked: false }));

      
      setTimeout(() => this.router.navigate(['/client-dashboard/salaries']), 1000);
    },
    error: (err) => {
       console.error(err); 
      // this.message = err.error?.message || 'Failed to create batch';
       alert(err.error?.message ?? "Already Paid employees");
      this.submitting = false;
      this.router.navigate(['/client-dashboard/salaries'])
        

    }
  });
  }

  cancel() { this.router.navigate(['/client-dashboard/salaries']); }


uploadSelectedCsv() {
  if (!this.selectedCsvFile) return;

  const form = new FormData();
  form.append("file", this.selectedCsvFile);

  this.svc.uploadCsv(form, this.clientId!).subscribe({
    next: res => {
      let message = `Batch Disbursement Completed\n\n`;
      message += `Successfully Paid: ${res.created}\n`;
      message += `Invalid Employees: ${res.skippedInvalid}\n`;
      message += `Already Paid (Last 30 Days): ${res.skippedAlreadyPaid}\n\n`;

      if (res.invalidEmployees?.length) {
        message += `Invalid Employee Codes:\n- ${res.invalidEmployees.join("\n- ")}\n\n`;
      }

      if (res.alreadyPaid?.length) {
        message += `Already Paid Employees:\n- ${res.alreadyPaid.join("\n- ")}\n`;
      }

      alert(message);
      this.router.navigate(['/client-dashboard/salaries']);
    },
    error: err => {
      const msg = err?.error?.message || "Error uploading CSV";
      alert(msg);
      this.router.navigate(['/client-dashboard/salaries']);
    }
  });
}


}
