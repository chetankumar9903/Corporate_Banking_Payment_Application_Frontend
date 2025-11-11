import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagedResult } from '../../models/PagedResult';
import { LoginSvc } from '../../services/login-svc';
import { BankSvc } from '../../services/bank-svc';
import { Payment } from '../../models/Payment';
import { SalaryDisbursement } from '../../models/SalaryDisbursement';
import { PaymentSvc } from '../../services/payment-svc';
import { SalaryDisbursementSvc } from '../../services/salary-disbursement-svc';
import { ClientSvc } from '../../services/client-svc';

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, CurrencyPipe],
  templateUrl: './all-transactions.html',
  styleUrls: ['./all-transactions.css']
})
export class AllTransactionsComponent implements OnInit {

  public activeView: 'payments' | 'salaries' = 'payments';
  public loading = false;
  public errorMessage = '';
  private bankName: string = '';

  public userSearchTerm: string = '';
  public sortColumn: string = 'requestDate';
  public sortOrder: 'ASC' | 'DESC' = 'DESC';
  public currentPage = 1;
  public pageSize = 10;
  public Math = Math;

  public allPayments: Payment[] = [];
  public filteredPayments: Payment[] = [];
  public paymentList: Payment[] = [];

  public allSalaries: SalaryDisbursement[] = [];
  public filteredSalaries: SalaryDisbursement[] = [];
  public salaryList: SalaryDisbursement[] = []; 
  private myClientIds: Set<number> = new Set(); 

  constructor(
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc,
    private paymentSvc: PaymentSvc,
    private salarySvc: SalaryDisbursementSvc,
    private clientSvc: ClientSvc 
  ) {}

  ngOnInit(): void {
    const id = this.loginSvc.getBankId();
    if (!id) {
      this.errorMessage = "Could not verify your Bank. Please re-login.";
      return;
    }
    this.loading = true;

    this.bankSvc.getBankById(id).subscribe({
      next: (bank) => {
        this.bankName = bank.bankName;
        
        this.loadMyClientIds();
      },
      error: (err) => {
        this.errorMessage = "Could not find your bank details.";
        this.loading = false;
      }
    });
  }


  loadMyClientIds(): void {
    this.clientSvc.getAllClients(1, 1000, 'companyName', 'ASC', this.bankName).subscribe({
      next: (result) => {
       
        this.myClientIds = new Set(result.items.map(client => client.clientId));
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = "Could not load client list.";
        this.loading = false;
      }
    });
  }


  loadData(): void {
    if (this.activeView === 'payments') {
      this.loadPayments();
    } else {
      this.loadSalaries();
    }
  }


  loadPayments(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.paymentSvc.getAllPayments(1, 1000, 'requestDate', 'DESC', this.bankName).subscribe({
      next: (result) => {
        
        this.allPayments = result.items; 
        
        this.applyPaymentFiltersAndPagination();
        
        this.salaryList = []; 
        this.loading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  loadSalaries(): void {
    this.loading = true;
    this.errorMessage = '';
    

    this.salarySvc.getAllSalaryDisbursements(1, 1000, 'date', 'DESC', '').subscribe({
      next: (result) => {

        this.allSalaries = result.items.filter(s => this.myClientIds.has(s.clientId));
        

        this.applySalaryFiltersAndPagination();
        
        this.paymentList = []; 
        this.loading = false;
      },
      error: (err) => this.handleError(err)
    });
  }


  applyPaymentFiltersAndPagination(): void {
    let tempPayments = [...this.allPayments];
    const searchTerm = this.userSearchTerm.toLowerCase();

    
    if (searchTerm) {
      tempPayments = tempPayments.filter(p => 
        (p.client?.companyName && p.client.companyName.toLowerCase().includes(searchTerm)) ||
        (p.beneficiary?.beneficiaryName && p.beneficiary.beneficiaryName.toLowerCase().includes(searchTerm)) ||
        (p.amount.toString().toLowerCase().includes(searchTerm)) ||
        (p.paymentStatus.toLowerCase().includes(searchTerm)) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

  
    tempPayments.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (this.sortColumn === 'companyName') aVal = a.client?.companyName || '';
      else if (this.sortColumn === 'beneficiaryName') aVal = a.beneficiary?.beneficiaryName || '';
      else aVal = (a as any)[this.sortColumn] || '';
      
      if (this.sortColumn === 'companyName') bVal = b.client?.companyName || '';
      else if (this.sortColumn === 'beneficiaryName') bVal = b.beneficiary?.beneficiaryName || '';
      else bVal = (b as any)[this.sortColumn] || '';

      let comparison = 0;
      if (aVal > bVal) comparison = 1;
      else if (aVal < bVal) comparison = -1;
      
      return this.sortOrder === 'ASC' ? comparison : -comparison;
    });

    this.filteredPayments = tempPayments;


    this.updatePagedPayments();
  }


  updatePagedPayments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paymentList = this.filteredPayments.slice(startIndex, endIndex);
  }


  applySalaryFiltersAndPagination(): void {
    let tempSalaries = [...this.allSalaries];
    const searchTerm = this.userSearchTerm.toLowerCase();

    if (searchTerm) {
      tempSalaries = tempSalaries.filter(s =>
        (s.clientCompanyName && s.clientCompanyName.toLowerCase().includes(searchTerm)) ||
        (s.employeeName && s.employeeName.toLowerCase().includes(searchTerm)) ||
        (s.description && s.description.toLowerCase().includes(searchTerm)) ||
        (s.amount.toString().includes(searchTerm)) ||
        (s.clientId.toString().includes(searchTerm)) ||
        (s.employeeId.toString().includes(searchTerm))
      );
    }

    tempSalaries.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (this.sortColumn === 'companyName') aVal = a.clientCompanyName || '';
      else if (this.sortColumn === 'lastName') aVal = a.employeeName || '';
      else aVal = (a as any)[this.sortColumn] || '';
      
      if (this.sortColumn === 'companyName') bVal = b.clientCompanyName || '';
      else if (this.sortColumn === 'lastName') bVal = b.employeeName || '';
      else bVal = (b as any)[this.sortColumn] || '';

      let comparison = 0;
      if (aVal > bVal) comparison = 1;
      else if (aVal < bVal) comparison = -1;
      
      return this.sortOrder === 'ASC' ? comparison : -comparison;
    });

    this.filteredSalaries = tempSalaries;

    this.updatePagedSalaries();
  }

  updatePagedSalaries(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.salaryList = this.filteredSalaries.slice(startIndex, endIndex);
  }


  onToggleView(view: 'payments' | 'salaries'): void {
    if (this.activeView === view) return;

    this.activeView = view;
    this.userSearchTerm = '';
    this.currentPage = 1;
    this.sortColumn = (view === 'payments') ? 'requestDate' : 'date';
    this.sortOrder = 'DESC';
    this.loadData();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    if (this.activeView === 'payments') {
      this.applyPaymentFiltersAndPagination(); 
    } else {
      this.applySalaryFiltersAndPagination(); 
    }
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'ASC';
    }
    this.currentPage = 1;
    if (this.activeView === 'payments') {
      this.applyPaymentFiltersAndPagination();
    } else {
      this.applySalaryFiltersAndPagination();
    }
  }


  nextPage(): void {
    const total = this.totalItemCount;
    if ((this.currentPage * this.pageSize) < total) {
      this.currentPage++;
      if (this.activeView === 'payments') this.updatePagedPayments();
      else this.updatePagedSalaries();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.activeView === 'payments') this.updatePagedPayments();
      else this.updatePagedSalaries();
    }
  }


  private handleError(err: any): void {
    this.errorMessage = 'Failed to load transactions.';
    console.error(err);
    this.loading = false;
  }

  get totalItemCount(): number {
    if (this.activeView === 'payments') {
      return this.filteredPayments.length; 
    } else {
      return this.filteredSalaries.length; 
    }
  }
}