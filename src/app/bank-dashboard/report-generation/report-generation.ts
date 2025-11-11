import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './report-generation.html',
  styleUrls: ['./report-generation.css']
})
export class ReportGenerationComponent implements OnInit {


  reportForm!: FormGroup;
  formLoading = false;
  formErrorMessage = '';
  formSuccessMessage = '';
  bankClients: Client[] = [];


  public reportTypeEnum = ReportType;
  public reportFormatEnum = ReportOutputFormat;
  public statusEnum = Status;
  public Math = Math;


  historyLoading = false;
  historyErrorMessage = '';
  public generatedReports: ReportDto[] = [];
  public pagedResult: PagedResult<ReportDto> | null = null;
  public loading = false;

  public currentPage = 1;
  public pageSize = 5; 
  public sortColumn: string = 'generatedDate';
  public sortOrder: 'ASC' | 'DESC' = 'DESC';
  public searchTerm: string = '';


  private userId!: number;
  private userRole!: UserRole;
  private bankName: string = '';


  constructor(
    private fb: FormBuilder,
    private reportSvc: ReportSvc,
    private clientSvc: ClientSvc,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc
  ) {

    this.reportForm = this.fb.group({
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      clientId: [null], 
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

    const bankId = this.loginSvc.getBankId();
    if (bankId) {
      this.bankSvc.getBankById(bankId).subscribe(bank => {
        this.bankName = bank.bankName;

        this.loadClientsForDropdown();
      });
    }

    this.loadReportHistory();
  }


  loadClientsForDropdown(): void {
    this.clientSvc.getAllClients(1, 1000, 'companyName', 'ASC', this.bankName).subscribe({
      next: (result) => {
        this.bankClients = result.items;
      },
      error: (err) => {
        console.error("Failed to load clients for dropdown:", err);
      }
    });
  }

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