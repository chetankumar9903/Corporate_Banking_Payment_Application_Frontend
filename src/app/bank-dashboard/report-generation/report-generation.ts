import { Component, OnInit } from '@angular/core';
// --- 1. Import NgClass, remove CurrencyPipe ---
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ReportSvc } from '../../services/report.svc';
// import { ClientSvc } from '../../services/client.svc';
import { LoginSvc } from '../../services/login-svc';
import { BankSvc } from '../../services/bank-svc';
import { Client } from '../../models/Client';
import { ReportDto, ReportType, ReportOutputFormat, GenerateReportRequestDto } from '../../models/Report';
import { Status } from '../../models/Customer';
import { UserRole } from '../../models/User';
import { PagedResult } from '../../models/PagedResult';
import { ClientSvc } from '../../services/client-svc';
import { ReportSvc } from '../../services/report-svc';

@Component({
  selector: 'app-report-generation',
  standalone: true,
  imports: [
    CommonModule,
    NgClass, // <-- Keep NgClass (for status badges, even though there are none here, good to have)
    FormsModule,
    ReactiveFormsModule,
    DatePipe
    // --- 2. CurrencyPipe removed (it was unused) ---
  ],
  templateUrl: './report-generation.html',
  styleUrls: ['./report-generation.css']
})
export class ReportGenerationComponent implements OnInit {

  // --- 3. THIS IS THE FIX ---
  // All properties are now correctly defined.

  // Form State
  reportForm!: FormGroup;
  formLoading = false;
  formErrorMessage = '';
  formSuccessMessage = '';
  bankClients: Client[] = []; // For the dropdown

  // Enums for the template
  public reportTypeEnum = ReportType;
  public reportFormatEnum = ReportOutputFormat;
  public statusEnum = Status;
  public Math = Math; // <-- Fixes the Math.ceil error

  // History Table State
  historyLoading = false;
  historyErrorMessage = '';
  public generatedReports: ReportDto[] = [];
  public pagedResult: PagedResult<ReportDto> | null = null;
  public loading = false;

  // History Paging & Sorting
  public currentPage = 1;
  public pageSize = 5; // Smaller page size for reports
  public sortColumn: string = 'generatedDate';
  public sortOrder: 'ASC' | 'DESC' = 'DESC';
  public searchTerm: string = '';

  // User Info
  private userId!: number;
  private userRole!: UserRole;
  private bankName: string = '';
  // --- END OF FIX ---

  constructor(
    private fb: FormBuilder,
    private reportSvc: ReportSvc,
    private clientSvc: ClientSvc,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc
  ) {
    // Initialize the form
    this.reportForm = this.fb.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: [null], // Not required, can be "All Clients"
      reportType: [ReportType.PAYMENT, [Validators.required]],
      outputFormat: [ReportOutputFormat.PDF, [Validators.required]],
      paymentStatusFilter: [null], // Hidden by default
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    // 1. Get User ID and Role (from your loginSvc fix)
    const uid = this.loginSvc.getUserId();
    const role = this.loginSvc.getRole();
    if (!uid || !role) {
      this.formErrorMessage = "User ID or Role not found. Please re-login.";
      this.reportForm.disable(); // Disable the form if no user
      return;
    }
    this.userId = uid;
    this.userRole = role as UserRole;

    // 2. Get Bank Name (to fetch clients)
    const bankId = this.loginSvc.getBankId();
    if (bankId) {
      this.bankSvc.getBankById(bankId).subscribe(bank => {
        this.bankName = bank.bankName;
        // 3. Load clients for the dropdown
        this.loadClientsForDropdown();
      });
    }

    // 4. Load initial report history
    this.loadReportHistory();
  }

  /**
   * Fetches all clients for this bank to populate the dropdown.
   */
  loadClientsForDropdown(): void {
    this.clientSvc.getAllClients(1, 1000, 'companyName', 'ASC', this.bankName).subscribe({
      next: (result) => {
        this.bankClients = result.items;
      },
      error: (err) => {
        console.error("Failed to load clients for dropdown:", err);
        // Not a fatal error
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

    // Build the DTO
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
          this.generatedReports.pop(); // Keep page size consistent
        }
        // Update total count for pagination
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