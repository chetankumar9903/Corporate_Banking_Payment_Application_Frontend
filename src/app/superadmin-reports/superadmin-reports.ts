import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ReportSvc } from '../services/report.svc';
// import { ClientSvc } from '../services/client.svc';
import { LoginSvc } from '../services/login-svc';
import { Client } from '../models/Client';
import { ReportDto, ReportType, ReportOutputFormat, GenerateReportRequestDto } from '../models/Report';
import { Status } from '../models/Customer';
import { UserRole } from '../models/User';
import { PagedResult } from '../models/PagedResult';
import { ReportSvc } from '../services/report-svc';
import { ClientSvc } from '../services/client-svc';

@Component({
  selector: 'app-superadmin-reports',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './superadmin-reports.html',
  styleUrls: ['./superadmin-reports.css']
})
export class SuperadminReportsComponent implements OnInit {

  // Form State
  reportForm!: FormGroup;
  formLoading = false;
  formErrorMessage = '';
  formSuccessMessage = '';
  allClients: Client[] = []; // For the dropdown

  // Enums for the template
  public reportTypeEnum = ReportType;
  public reportFormatEnum = ReportOutputFormat;
  public statusEnum = Status;
  public Math = Math;

  // History Table State
  historyLoading = false;
  historyErrorMessage = '';
  public generatedReports: ReportDto[] = [];
  public pagedResult: PagedResult<ReportDto> | null = null;

  // History Paging & Sorting
  public currentPage = 1;
  public pageSize = 5;
  public sortColumn: string = 'generatedDate';
  public sortOrder: 'ASC' | 'DESC' = 'DESC';
  public searchTerm: string = '';

  // User Info
  private userId!: number;
  private userRole!: UserRole;

  constructor(
    private fb: FormBuilder,
    private reportSvc: ReportSvc,
    private clientSvc: ClientSvc,
    private loginSvc: LoginSvc
  ) {
    this.reportForm = this.fb.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: [null], // Not required
      reportType: [ReportType.PAYMENT, [Validators.required]],
      outputFormat: [ReportOutputFormat.PDF, [Validators.required]],
      paymentStatusFilter: [null],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    const uid = this.loginSvc.getUserId();
    const role = this.loginSvc.getRole();
    if (!uid || !role) {
      this.formErrorMessage = "User ID or Role not found. Please re-login.";
      this.reportForm.disable();
      return;
    }
    this.userId = uid;
    this.userRole = role as UserRole;

    // Load ALL clients for the dropdown
    this.loadClientsForDropdown();
    // Load initial report history
    this.loadReportHistory();
  }

  /**
   * Fetches ALL clients (Super Admin) to populate the dropdown.
   */
  loadClientsForDropdown(): void {
    // Pass an EMPTY string as searchTerm to get ALL clients
    this.clientSvc.getAllClients(1, 1000, 'companyName', 'ASC', "").subscribe({
      next: (result) => {
        this.allClients = result.items;
      },
      error: (err) => {
        console.error("Failed to load all clients for dropdown:", err);
      }
    });
  }

  /**
   * Fetches the paged list of previously generated reports.
   */
  loadReportHistory(): void {
    this.historyLoading = true;
    this.historyErrorMessage = '';
    this.reportSvc.getReportHistory(
      this.userId,
      this.currentPage,
      this.pageSize,
      this.sortColumn,
      this.sortOrder,
      this.searchTerm
    ).subscribe({
      next: (result) => {
        this.pagedResult = result;
        this.generatedReports = result.items;
        this.historyLoading = false;
      },
      error: (err) => {
        this.historyErrorMessage = "Failed to load report history.";
        this.historyLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Handles the form submission to generate a new report.
   */
  onGenerateReport(): void {
    if (this.reportForm.invalid) {
      this.formErrorMessage = "Please fill out all required fields.";
      this.reportForm.markAllAsTouched();
      return;
    }

    this.formLoading = true;
    this.formErrorMessage = '';
    this.formSuccessMessage = '';
    const formVal = this.reportForm.value;

    const dto: GenerateReportRequestDto = {
      reportName: formVal.reportName,
      reportType: formVal.reportType,
      outputFormat: formVal.outputFormat,
      clientId: formVal.clientId ? +formVal.clientId : null,
      paymentStatusFilter: formVal.paymentStatusFilter ? formVal.paymentStatusFilter : null,
      startDate: formVal.startDate || undefined,
      endDate: formVal.endDate || undefined
    };

    this.reportSvc.generateReport(dto, this.userId, this.userRole).subscribe({
      next: (newReport) => {
        this.formLoading = false;
        this.formSuccessMessage = `Successfully generated report: ${newReport.reportName}`;
        this.reportForm.reset({
          reportType: ReportType.PAYMENT,
          outputFormat: ReportOutputFormat.PDF,
          paymentStatusFilter: null,
          clientId: null
        });
        
        // Add new report to the top of the history list
        this.generatedReports.unshift(newReport);
        if (this.generatedReports.length > this.pageSize) {
          this.generatedReports.pop();
        }
        if (this.pagedResult) {
          this.pagedResult.totalCount++;
        }
      },
      error: (err) => {
        this.formErrorMessage = err.error?.message || "An unknown error occurred.";
        this.formLoading = false;
        console.error(err);
      }
    });
  }

  // --- History Table Functions ---
  onSearchChange(): void {
    this.currentPage = 1;
    this.loadReportHistory();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'ASC';
    }
    this.currentPage = 1;
    this.loadReportHistory();
  }

  nextPage(): void {
    if (this.pagedResult && (this.currentPage * this.pageSize) < this.pagedResult.totalCount) {
      this.currentPage++;
      this.loadReportHistory();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReportHistory();
    }
  }
}