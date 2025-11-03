import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenerateReportRequest, ReportOutputFormat, ReportType } from '../models/Report';
import { ReportSvc } from '../services/report-svc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-generate',
    standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-generate.html',
  styleUrl: './report-generate.css',
})
export class ReportGenerate {
form: FormGroup;
  ReportType = ReportType; // for template enums
  ReportOutputFormat = ReportOutputFormat;
  loading = false;
  message = '';

  constructor(private fb: FormBuilder, private svc: ReportSvc, private router: Router) {
    this.form = this.fb.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      reportType: [ReportType.PAYMENT, Validators.required],
      outputFormat: [ReportOutputFormat.PDF, Validators.required],
      clientId: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload: GenerateReportRequest = {
      reportName: this.form.value.reportName,
      reportType: this.form.value.reportType,
      outputFormat: this.form.value.outputFormat,
      clientId: this.form.value.clientId || null,
      startDate: this.form.value.startDate || null,
      endDate: this.form.value.endDate || null
    };

    this.svc.generateReport(payload).subscribe({
      next: (r) => {
        this.loading = false;
        this.message = `Report requested. Click History to download once ready.`;
        // optional: navigate to history
        // this.router.navigate(['/superadmin-dashboard/reports/history']);
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.error || err?.message || 'Failed to generate';
      }
    });
  }
}
