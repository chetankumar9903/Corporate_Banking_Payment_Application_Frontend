import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerSvc } from '../../services/customer-svc';
import { Customer, Status } from '../../models/Customer';
import { PagedResult } from '../../models/PagedResult';
import { LoginSvc } from '../../services/login-svc';
import { BankSvc } from '../../services/bank-svc';
import { DocumentSvc } from '../../services/document-svc';
import { DocumentDto } from '../../models/Document';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-verification',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-verification.html',
  styleUrls: ['./customer-verification.css']
})
export class CustomerVerificationComponent implements OnInit {

  @ViewChild('modalFileInput') modalFileInput!: ElementRef<HTMLInputElement>;

  public allCustomers: Customer[] = []; 
  public filteredCustomers: Customer[] = [];
  public customers: Customer[] = [];
  public pagedResult: PagedResult<Customer> | null = null;
  public statusEnum = Status;
  public Math = Math;
  public loading = false;
  public errorMessage = '';
  public currentPage = 1;
  public pageSize = 10;
  public bankId!: number;
  private bankName: string = '';
  public userSearchTerm: string = '';
  public statusFilter: string = 'ALL';
  public sortColumn: string = 'onboardingDate';
  public sortOrder: 'ASC' | 'DESC' = 'DESC';
  
  public isModalVisible = false;
  public modalLoading = false;
  public modalError = '';
  public selectedCustomer: Customer | null = null;
  public loadedDocuments: DocumentDto[] = [];
  
  public uploadForm!: FormGroup;
  public selectedFile: File | null = null;
  public documentTypes = [
    'AADHAR CARD', 
    'PAN CARD', 
    'PASSPORT', 
    'DRIVING LISCENCE', 
    'VOTER ID'
  ];
  

  constructor(
    private customerSvc: CustomerSvc,
    private router: Router,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc,
    private documentSvc: DocumentSvc,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      documentType: [this.documentTypes[0], [Validators.required]]
    });
  }

 
  ngOnInit(): void {
    const id = this.loginSvc.getBankId();
    if (!id) {
      this.errorMessage = "Could not verify your Bank. Please re-login.";
      return;
    }
    this.bankId = id;
    this.loading = true;

    this.bankSvc.getBankById(this.bankId).subscribe({
      next: (bank) => {
        this.bankName = bank.bankName;
        this.loadAllCustomers(); 
      },
      error: (err) => {
        this.errorMessage = "Could not find your bank details.";
        this.loading = false;
      }
    });
  }

  loadAllCustomers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.customerSvc.getAllCustomers(1, 1000, this.sortColumn, this.sortOrder, this.bankName).subscribe({
      next: (result) => {
        this.allCustomers = result.items; 
        this.applyFiltersAndPagination(); 
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load customers.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'ASC';
    }
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  applyFiltersAndPagination(): void {
    let tempCustomers = [...this.allCustomers];

    if (this.statusFilter !== 'ALL') {
      tempCustomers = tempCustomers.filter(c => c.verificationStatus === this.statusFilter);
    }

    const searchTerm = this.userSearchTerm.toLowerCase();
    if (searchTerm) {
      tempCustomers = tempCustomers.filter(c => 
        c.userName && c.userName.toLowerCase().includes(searchTerm)
      );
    }

    tempCustomers.sort((a, b) => {
      const aVal = (a as any)[this.sortColumn] || ''; 
      const bVal = (b as any)[this.sortColumn] || '';

      let comparison = 0;
      if (aVal > bVal) {
        comparison = 1;
      } else if (aVal < bVal) {
        comparison = -1;
      }
      return this.sortOrder === 'ASC' ? comparison : -comparison;
    });

    this.filteredCustomers = tempCustomers;
    this.updatePagedCustomers();
  }

  updatePagedCustomers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.customers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage * this.pageSize) < this.filteredCustomers.length) {
      this.currentPage++;
      this.updatePagedCustomers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedCustomers();
    }
  }
  
  onApprove(customer: Customer): void {
    if (!confirm(`Are you sure you want to approve ${customer.userName}?`)) {
      return;
    }
    this.loading = true;
    this.customerSvc.updateCustomerStatus(customer.customerId, Status.APPROVED).subscribe({
      next: () => {
        this.router.navigate(['/bank-dashboard/create-client', customer.customerId]);
      },
      error: (err) => {
        this.errorMessage = `Failed to approve customer ${customer.userName}.`;
        this.loading = false;
      }
    });
  }

  onReject(customer: Customer): void {
    if (!confirm(`Are you sure you want to REJECT ${customer.userName}? This action cannot be undone.`)) {
      return;
    }
    this.loading = true;
    this.customerSvc.updateCustomerStatus(customer.customerId, Status.REJECTED).subscribe({
      next: (updatedCustomer) => {
        this.updateCustomerInList(updatedCustomer);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = `Failed to reject customer ${customer.userName}.`;
        this.loading = false;
      }
    });
  }
  
  getStatusText(status: Status | string): string {
    switch (status) {
      case Status.PENDING: return 'Pending';
      case Status.APPROVED: return 'Approved';
      case Status.REJECTED: return 'Rejected';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: Status | string): string {
     switch (status) {
      case Status.PENDING: return 'status-pending';
      case Status.APPROVED: return 'status-approved';
      case Status.REJECTED: return 'status-rejected';
      default: return '';
    }
  }

  viewDocuments(customer: Customer): void {
    this.selectedCustomer = customer;
    this.isModalVisible = true;
    this.modalLoading = true;
    this.modalError = '';
    this.loadedDocuments = [];
    this.selectedFile = null; 
    this.uploadForm.reset({ documentType: this.documentTypes[0] });

    this.loadModalDocuments();
  }

  loadModalDocuments(): void {
    if (!this.selectedCustomer) return;
    this.modalLoading = true;
    this.documentSvc.getDocumentsByCustomer(this.selectedCustomer.customerId).subscribe({
      next: (docs) => {
        this.loadedDocuments = docs;
        this.modalLoading = false;
      },
      error: (err) => {
        this.modalError = 'Failed to load documents.';
        this.modalLoading = false;
      }
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedCustomer = null;
    this.loadedDocuments = [];
  }

  onDeleteDocument(docToDelete: DocumentDto): void {
    if (!confirm(`Are you sure you want to delete the document: ${docToDelete.documentName}?`)) {
      return;
    }
    this.modalLoading = true;
    this.documentSvc.deleteDocument(docToDelete.documentId).subscribe({
      next: () => {
        this.loadModalDocuments();
      },
      error: (err) => {
        this.modalError = 'Failed to delete document.';
        this.modalLoading = false;
        console.error(err);
      }
    });
  }

  onFileSelectedInModal(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.modalError = '';
    }
  }

  onUploadNewDocument(): void {
    if (this.uploadForm.invalid || !this.selectedFile || !this.selectedCustomer) {
      this.modalError = "Please select a document type and a file to upload.";
      return;
    }

    this.modalLoading = true;
    this.modalError = '';

    this.documentSvc.uploadDocument(
      this.selectedCustomer.customerId,
      this.uploadForm.value.documentType,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.loadModalDocuments();
        this.selectedFile = null;
        if(this.modalFileInput) this.modalFileInput.nativeElement.value = '';
        this.uploadForm.reset({ documentType: this.documentTypes[0] });
      },
      error: (err) => {
        this.modalError = err.error?.message || 'Failed to upload document.';
        this.modalLoading = false;
      }
    });
  }

  onResubmit(customer: Customer): void {
    if (!confirm(`Are you sure you want to re-submit ${customer.userName} for verification?`)) {
      return;
    }
    this.loading = true;
    this.customerSvc.updateCustomerStatus(customer.customerId, Status.PENDING).subscribe({
      next: (updatedCustomer) => {
        this.updateCustomerInList(updatedCustomer);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = `Failed to re-submit customer ${customer.userName}.`;
        this.loading = false;
        console.error(err);
      }
    });
  }

  private updateCustomerInList(updatedCustomer: Customer): void {
    const index = this.allCustomers.findIndex(c => c.customerId === updatedCustomer.customerId);
    if (index !== -1) {
      this.allCustomers[index].verificationStatus = updatedCustomer.verificationStatus;
    }
    this.applyFiltersAndPagination();
  }

}