import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentSvc } from '../services/payment-svc';
import { Payment } from '../models/Payment';
import { Status } from '../models/Status';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-list.html',
  styleUrls: ['./payment-list.css']
})
export class PaymentList implements OnInit {
   Status = Status;
  payments: Payment[] = [];
  loading = false;
  clientId!: number;

  constructor(private svc: PaymentSvc, private router: Router) {}

  ngOnInit(): void {
    const id = localStorage.getItem('clientId');
    if (id) this.clientId = +id;
    this.load();
  }

  load() {
    if (!this.clientId) return;
    this.loading = true;
    this.svc.getByClientId(this.clientId).subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
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

  getStatusLabel(status: Status) {
    switch (status) {
      case Status.PENDING: return 'Pending';
      case Status.APPROVED: return 'Approved';
      case Status.REJECTED: return 'Rejected';
      default: return 'Unknown';
    }
  }
}
