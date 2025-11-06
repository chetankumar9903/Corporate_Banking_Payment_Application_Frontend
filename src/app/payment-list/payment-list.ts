import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentSvc } from '../services/payment-svc';
import { Payment } from '../models/Payment';
import { Status } from '../models/Status';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BeneficiarySvc } from '../services/beneficiary-svc';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './payment-list.html',
  styleUrls: ['./payment-list.css']
})
export class PaymentList implements OnInit {
  beneficiaryMap: { [id: number]: string } = {};

   Status = Status;
  payments: Payment[] = [];
   filteredPayments: Payment[] = [];
  loading = false;
  clientId!: number;

    searchTerm = '';
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private svc: PaymentSvc, private router: Router, private benSvc : BeneficiarySvc) {}

  ngOnInit(): void {
    const id = localStorage.getItem('clientId');
    if (id) this.clientId = +id;
    this.load();
  }
 
  // load() {
  //   if (!this.clientId) return;
  //   this.loading = true;
  //   this.svc.getByClientId(this.clientId).subscribe({
  //     next: (data) => {
  //       // this.payments = data;
  //       // this.loading = false;

  //        this.payments = data;
  //       this.filteredPayments = [...data];

  //        // Fetch beneficiary names
  //     this.payments.forEach(p => {
  //       if (!this.beneficiaryMap[p.beneficiaryId]) {
  //         this.benSvc.getById(p.beneficiaryId).subscribe({
  //           next: (b) => this.beneficiaryMap[p.beneficiaryId] = b.beneficiaryName,
  //           error: () => this.beneficiaryMap[p.beneficiaryId] = '—'
  //         });
  //       }
  //     });
  //       this.updatePagination();
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading payments', err);
  //       this.loading = false;
  //     }
  //   });
  // }

  load() {
  if (!this.clientId) return;
  this.loading = true;

  this.svc.getByClientId(this.clientId).subscribe({
    next: (data) => {
      this.payments = data;
      this.filteredPayments = [...data];

      // Get unique beneficiary IDs
      const uniqueIds = Array.from(new Set(this.payments.map(p => p.beneficiaryId)));

      // Build an array of observables
      const requests = uniqueIds.map(id =>
        this.benSvc.getById(id)
      );

      // Execute all requests in parallel
      forkJoin(requests).subscribe({
        next: (beneficiaries) => {
          beneficiaries.forEach(b => {
            this.beneficiaryMap[b.beneficiaryId] = b.beneficiaryName;
          });
          this.loading = false;
        },
        error: () => {
          uniqueIds.forEach(id => this.beneficiaryMap[id] = '—');
          this.loading = false;
        }
      });

      this.updatePagination();
    },
    error: (err) => {
      console.error('Error loading payments', err);
      this.loading = false;
    }
  });
}

  add() {
    this.router.navigate(['/client-dashboard/payments/add']);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.svc.delete(id).subscribe({
        next: () => {
          alert('Payment deleted successfully.');
          this.load();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
 // --- Sorting ---
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    this.filteredPayments.sort((a: any, b: any) => {
      const valA = a[column];
      const valB = b[column];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return this.sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }

  // --- Search / Filter ---
  search() {
    const term = this.searchTerm.toLowerCase();

  this.filteredPayments = this.payments.filter(p => {
    const name = this.beneficiaryMap[p.beneficiaryId] || ''; // get name from map
    return name.toLowerCase().includes(term) ||
           this.getStatusLabel(p.paymentStatus).toLowerCase().includes(term);
  });

  this.pageNumber = 1;
  this.updatePagination();
  }

  clearFilter() {
    this.searchTerm = '';
    this.filteredPayments = [...this.payments];
    this.updatePagination();
  }

  // --- Pagination ---
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPayments.length / this.pageSize) || 1;
    if (this.pageNumber > this.totalPages) this.pageNumber = this.totalPages;
  }

  pagedPayments() {
    const start = (this.pageNumber - 1) * this.pageSize;
    return this.filteredPayments.slice(start, start + this.pageSize);
  }

  prevPage() { if (this.pageNumber > 1) this.pageNumber--; }
  nextPage() { if (this.pageNumber < this.totalPages) this.pageNumber++; }

  getStatusLabel(status: Status) {
    switch (status) {
      case Status.PENDING: return 'Pending';
      case Status.APPROVED: return 'Approved';
      case Status.REJECTED: return 'Rejected';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: Status) {
    switch (status) {
      case Status.PENDING: return 'bg-warning text-dark';
      case Status.APPROVED: return 'bg-success';
      case Status.REJECTED: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  selectedRejectReason: string | null = null;

showRejectReason(reason?: string) {
  this.selectedRejectReason = reason || 'No reason was provided.';
  const modal: any = new (window as any).bootstrap.Modal(
    document.getElementById('rejectReasonModal')
  );
  modal.show();
}

}
