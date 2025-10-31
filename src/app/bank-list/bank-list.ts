import { Component } from '@angular/core';
import { BankSvc } from '../services/bank-svc';
import { Router } from '@angular/router';
import { Bank } from '../models/Bank';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-list',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './bank-list.html',
  styleUrl: './bank-list.css',
})
export class BankList {
 banks: Bank[] = [];
  loading = false;

  constructor(private bankService: BankSvc, private router: Router) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  fetchBanks(): void {
    this.loading = true;
    this.bankService.getAllBanks().subscribe({
      next: (data) => {
        this.banks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch banks', err);
        this.loading = false;
      }
    });
  }

  addBank() {
    this.router.navigate(['/superadmin-dashboard/banks/add']);
  }

  editBank(id: number) {
    this.router.navigate(['/superadmin-dashboard/banks/edit', id]);
  }

  deleteBank(id: number) {
    if (confirm('Are you sure you want to delete this bank?')) {
      this.bankService.deleteBank(id).subscribe({
        next: () => {
          // Refresh list after deletion
          this.fetchBanks();
        },
        error: (err) => console.error('Failed to delete bank', err)
      });
    }
  }
}
