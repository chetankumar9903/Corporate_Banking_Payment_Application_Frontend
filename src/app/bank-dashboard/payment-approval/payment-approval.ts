// import { Component, OnInit } from '@angular/core';
// import { CommonModule, NgClass, CurrencyPipe } from '@angular/common';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { PaymentSvc } from '../../services/payment.svc';
// import { Payment, UpdatePaymentDto } from '../../models/Payment';
// import { PagedResult } from '../../models/PagedResult';
// import { LoginSvc } from '../../services/login-svc';
// import { BankSvc } from '../../services/bank-svc';
// import { Status } from '../../models/Customer';
// import { PaymentSvc } from '../../services/payment-svc';

// @Component({
//   selector: 'app-payment-approval',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     NgClass, 
//     FormsModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './payment-approval.html',
//   styleUrls: ['./payment-approval.css'],
//   providers: [CurrencyPipe] // Provide CurrencyPipe
// })
// export class PaymentApprovalComponent implements OnInit {

//   // Master list
//   public allPayments: Payment[] = [];
//   // Filtered/Sorted list
//   public filteredPayments: Payment[] = [];
//   // Paged list for the table
//   public payments: Payment[] = [];

//   public pagedResult: PagedResult<Payment> | null = null;
//   public Math = Math;
//   public loading = false;
//   public errorMessage = '';

//   // Paging & Bank Info
//   public currentPage = 1;
//   public pageSize = 10;
//   private bankName: string = '';

//   // Filter & Sort State
//   public userSearchTerm: string = '';
//   public sortColumn: string = 'requestDate';
//   public sortOrder: 'ASC' | 'DESC' = 'DESC';

//   // Modal State
//   public isRejectModalVisible = false;
//   public currentPaymentToReject: Payment | null = null;
//   public rejectionForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private paymentSvc: PaymentSvc,
//     private loginSvc: LoginSvc,
//     private bankSvc: BankSvc,
//     private router: Router,
//     private currencyPipe: CurrencyPipe // Inject CurrencyPipe
//   ) {
//     this.rejectionForm = this.fb.group({
//       rejectReason: ['', [Validators.required, Validators.maxLength(200)]]
//     });
//   }

//   ngOnInit(): void {
//     const id = this.loginSvc.getBankId();
//     if (!id) {
//       this.errorMessage = "Could not verify your Bank. Please re-login.";
//       return;
//     }
//     this.loading = true;

//     // 1. Get the bank name
//     this.bankSvc.getBankById(id).subscribe({
//       next: (bank) => {
//         this.bankName = bank.bankName;
//         // 2. Load ALL payments for this bank
//         this.loadAllPayments(); 
//       },
//       error: (err) => {
//         this.errorMessage = "Could not find your bank details.";
//         this.loading = false;
//       }
//     });
//   }

//   /**
//    * Fetches ALL payments for the bank (up to 1000)
//    * and stores them in the master list.
//    */
//   loadAllPayments(): void {
//     this.loading = true;
//     this.errorMessage = '';
    
//     // Fetch all payments for this bank, sorted by date
//     this.paymentSvc.getAllPayments(1, 1000, 'requestDate', 'DESC', this.bankName).subscribe({
//       next: (result) => {
//         this.allPayments = result.items; 
//         this.applyFiltersAndPagination(); // Apply filters
//         this.loading = false;
//       },
//       error: (err) => {
//         this.errorMessage = 'Failed to load payment requests.';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   /**
//    * Applies all client-side filtering, sorting, and pagination.
//    */
//   applyFiltersAndPagination(): void {
//     let tempPayments = [...this.allPayments];

//     // 1. Filter for PENDING status (as required)
//     tempPayments = tempPayments.filter(p => p.paymentStatus === Status.PENDING);

//     // 2. Filter by Generic Search Term
//     const searchTerm = this.userSearchTerm.toLowerCase();
//     if (searchTerm) {
//       tempPayments = tempPayments.filter(p => 
//         (p.client?.companyName && p.client.companyName.toLowerCase().includes(searchTerm)) ||
//         (p.beneficiary?.beneficiaryName && p.beneficiary.beneficiaryName.toLowerCase().includes(searchTerm)) ||
//         (p.beneficiary?.accountNumber && p.beneficiary.accountNumber.toLowerCase().includes(searchTerm)) ||
//         (p.amount.toString().toLowerCase().includes(searchTerm))
//       );
//     }

//     // 3. Sort the filtered list
//     tempPayments.sort((a, b) => {
//       let aVal: any;
//       let bVal: any;

//       if (this.sortColumn === 'companyName') {
//         aVal = a.client?.companyName || '';
//         bVal = b.client?.companyName || '';
//       } else if (this.sortColumn === 'beneficiaryName') {
//         aVal = a.beneficiary?.beneficiaryName || '';
//         bVal = b.beneficiary?.beneficiaryName || '';
//       } else {
//         aVal = (a as any)[this.sortColumn] || '';
//         bVal = (b as any)[this.sortColumn] || '';
//       }

//       let comparison = 0;
//       if (aVal > bVal) comparison = 1;
//       else if (aVal < bVal) comparison = -1;
      
//       return this.sortOrder === 'ASC' ? comparison : -comparison;
//     });

//     this.filteredPayments = tempPayments;

//     // 4. Apply pagination
//     this.updatePagedPayments();
//   }

//   /**
//    * Slices the filtered list for display.
//    */
//   updatePagedPayments(): void {
//     const startIndex = (this.currentPage - 1) * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.payments = this.filteredPayments.slice(startIndex, endIndex);
//   }

//   /**
//    * Called when the user types in the search box.
//    */
//   onSearchChange(): void {
//     this.currentPage = 1; // Reset to first page
//     this.applyFiltersAndPagination();
//   }

//   /**
//    * Called when a table header is clicked.
//    */
//   onSort(column: string): void {
//     if (this.sortColumn === column) {
//       this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
//     } else {
//       this.sortColumn = column;
//       this.sortOrder = 'ASC';
//     }
//     this.currentPage = 1; // Reset to first page
//     this.applyFiltersAndPagination();
//   }

//   /**
//    * Approves a payment.
//    */
//   onApprove(payment: Payment): void {
//     // Use the injected CurrencyPipe
//     const formattedAmount = this.currencyPipe.transform(payment.amount, 'INR');
    
//     if (!confirm(`Are you sure you want to APPROVE this payment of ${formattedAmount}? This will trigger the transaction.`)) {
//       return;
//     }

//     this.loading = true;
//     const dto: UpdatePaymentDto = {
//       paymentStatus: Status.APPROVED,
//       rejectReason: '' // Send empty reason
//     };

//     this.paymentSvc.updatePayment(payment.paymentId, dto).subscribe({
//       next: () => {
//         // Refresh the master list from the API
//         this.loadAllPayments(); 
//       },
//       error: (err) => {
//         this.errorMessage = err.error?.message || 'Failed to approve payment.';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   /**
//    * Opens the rejection modal.
//    */
//   openRejectModal(payment: Payment): void {
//     this.currentPaymentToReject = payment;
//     this.isRejectModalVisible = true;
//     this.rejectionForm.reset();
//   }

//   /**
//    * Closes the rejection modal.
//    */
//   closeRejectModal(): void {
//     this.isRejectModalVisible = false;
//     this.currentPaymentToReject = null;
//     this.errorMessage = ''; // Clear any modal-related errors
//   }

//   /**
//    * Submits the rejection reason from the modal.
//    */
//   submitRejection(): void {
//     if (this.rejectionForm.invalid || !this.currentPaymentToReject) {
//       this.rejectionForm.markAllAsTouched();
//       return;
//     }

//     this.loading = true;
//     const dto: UpdatePaymentDto = {
//       paymentStatus: Status.REJECTED,
//       rejectReason: this.rejectionForm.value.rejectReason
//     };

//     this.paymentSvc.updatePayment(this.currentPaymentToReject.paymentId, dto).subscribe({
//       next: () => {
//         this.closeRejectModal();
//         // Refresh the master list from the API
//         this.loadAllPayments();
//       },
//       error: (err) => {
//         // Show error *inside* the modal
//         this.errorMessage = err.error?.message || 'Failed to reject payment.';
//         console.error(err);
//         this.loading = false; // Stop loading, but keep modal open
//       }
//     });
//   }

//   // --- Pagination ---
//   nextPage(): void {
//     if ((this.currentPage * this.pageSize) < this.filteredPayments.length) {
//       this.currentPage++;
//       this.updatePagedPayments();
//     }
//   }

//   prevPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePagedPayments();
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { PaymentSvc } from '../../services/payment.svc';
import { Payment, UpdatePaymentDto } from '../../models/Payment';
import { PagedResult } from '../../models/PagedResult';
import { LoginSvc } from '../../services/login-svc';
import { BankSvc } from '../../services/bank-svc';
import { Status } from '../../models/Customer';
import { PaymentSvc } from '../../services/payment-svc';

@Component({
  selector: 'app-payment-approval',
  standalone: true,
  imports: [
    CommonModule, 
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment-approval.html',
  styleUrls: ['./payment-approval.css'],
  providers: [CurrencyPipe] 
})
export class PaymentApprovalComponent implements OnInit {

  // Master list
  public allPayments: Payment[] = [];
  // Filtered/Sorted list
  public filteredPayments: Payment[] = [];
  // Paged list for the table
  public payments: Payment[] = [];

  public pagedResult: PagedResult<Payment> | null = null;
  public Math = Math;
  public loading = false;
  public errorMessage = '';

  // Paging & Bank Info
  public currentPage = 1;
  public pageSize = 10;
  private bankName: string = '';

  // Filter & Sort State
  public userSearchTerm: string = '';
  public sortColumn: string = 'requestDate';
  public sortOrder: 'ASC' | 'DESC' = 'DESC';
  
  public statusFilter: string = 'PENDING';
  public statusEnum = Status;

  // Modal State
  public isRejectModalVisible = false;
  public currentPaymentToReject: Payment | null = null;
  public rejectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentSvc: PaymentSvc,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc,
    private router: Router,
    private currencyPipe: CurrencyPipe
  ) {
    // This form is correct
    this.rejectionForm = this.fb.group({
      rejectReason: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

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
        this.loadAllPayments(); 
      },
      error: (err) => {
        this.errorMessage = "Could not find your bank details.";
        this.loading = false;
      }
    });
  }

  loadAllPayments(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Fetch all payments for this bank
    this.paymentSvc.getAllPayments(1, 1000, 'requestDate', 'DESC', this.bankName).subscribe({
      next: (result) => {
        this.allPayments = result.items; 
        this.applyFiltersAndPagination(); 
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load payment requests.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFiltersAndPagination(): void {
    let tempPayments = [...this.allPayments];

    // 1. Filter by Status
    if (this.statusFilter !== 'ALL') {
      tempPayments = tempPayments.filter(p => p.paymentStatus === this.statusFilter);
    }

    // 2. Filter by Generic Search Term
    const searchTerm = this.userSearchTerm.toLowerCase();
    if (searchTerm) {
      tempPayments = tempPayments.filter(p => 
        (p.client?.companyName && p.client.companyName.toLowerCase().includes(searchTerm)) ||
        (p.beneficiary?.beneficiaryName && p.beneficiary.beneficiaryName.toLowerCase().includes(searchTerm)) ||
        (p.beneficiary?.accountNumber && p.beneficiary.accountNumber.toLowerCase().includes(searchTerm)) ||
        (p.amount.toString().toLowerCase().includes(searchTerm))
      );
    }

    // 3. Sort the filtered list
    tempPayments.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (this.sortColumn === 'companyName') {
        aVal = a.client?.companyName || '';
        bVal = b.client?.companyName || '';
      } else if (this.sortColumn === 'beneficiaryName') {
        aVal = a.beneficiary?.beneficiaryName || '';
        bVal = b.beneficiary?.beneficiaryName || '';
      } else {
        aVal = (a as any)[this.sortColumn] || '';
        bVal = (b as any)[this.sortColumn] || '';
      }

      let comparison = 0;
      if (aVal > bVal) comparison = 1;
      else if (aVal < bVal) comparison = -1;
      
      return this.sortOrder === 'ASC' ? comparison : -comparison;
    });

    this.filteredPayments = tempPayments;

    // 4. Apply pagination
    this.updatePagedPayments();
  }

  updatePagedPayments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.payments = this.filteredPayments.slice(startIndex, endIndex);
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

  onApprove(payment: Payment): void {
    const formattedAmount = this.currencyPipe.transform(payment.amount, 'INR');
    if (!confirm(`Are you sure you want to APPROVE this payment of ${formattedAmount}? This will trigger the transaction.`)) {
      return;
    }

    this.loading = true;
    const dto: UpdatePaymentDto = {
      paymentStatus: Status.APPROVED,
      rejectReason: ''
    };

    // This will now call the correct service method
    this.paymentSvc.updatePayment(payment.paymentId, dto).subscribe({
      next: () => {
        this.loadAllPayments(); 
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to approve payment.';
        console.error(err);
        this.loading = false;
      }
    });
  }
  
  openRejectModal(payment: Payment): void {
    this.currentPaymentToReject = payment;
    this.isRejectModalVisible = true;
    this.rejectionForm.reset();
  }

  closeRejectModal(): void {
    this.isRejectModalVisible = false;
    this.currentPaymentToReject = null;
    this.errorMessage = '';
  }

  submitRejection(): void {
    if (this.rejectionForm.invalid || !this.currentPaymentToReject) {
      this.rejectionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const dto: UpdatePaymentDto = {
      paymentStatus: Status.REJECTED,
      rejectReason: this.rejectionForm.value.rejectReason
    };

    // This will now call the correct service method
    this.paymentSvc.updatePayment(this.currentPaymentToReject.paymentId, dto).subscribe({
      next: () => {
        this.closeRejectModal();
        this.loadAllPayments();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to reject payment.';
        console.error(err);
        this.loading = false; 
      }
    });
  }

  nextPage(): void {
    if ((this.currentPage * this.pageSize) < this.filteredPayments.length) {
      this.currentPage++;
      this.updatePagedPayments();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedPayments();
    }
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
}