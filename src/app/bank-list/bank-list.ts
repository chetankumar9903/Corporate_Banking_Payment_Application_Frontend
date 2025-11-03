import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BankSvc } from '../services/bank-svc';
import { Bank } from '../models/Bank';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-list.html',
  styleUrls: ['./bank-list.css'],
})
export class BankList implements OnInit {
  banks: Bank[] = [];
  loading = false;

  constructor(private bankService: BankSvc, private router: Router) {}

  ngOnInit(): void {
    this.fetchBanks();
  }

  // fetchBanks() {
  //   this.loading = true;
  //   this.bankService.getAllBanks().subscribe({
  //     next: (data) => {
  //       this.banks = data;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch banks', err);
  //       this.loading = false;
  //     },
  //   });
  // }


//   fetchBanks() {
//   this.loading = true;
//   this.bankService.getAllBanks().subscribe({
//     next: (response) => {
//       // If backend returns paginated object (with data property)
//       this.banks = Array.isArray(response) ? response : response.data;
//       this.loading = false;
//       console.log('Banks loaded:', this.banks);
//     },
//     error: (err) => {
//       console.error('Failed to fetch banks', err);
//       this.loading = false;
//     },
//   });
// }

totalCount = 0;

fetchBanks(): void {
  this.loading = true;
  this.bankService.getAllBanks().subscribe({
    next: (response) => {
      this.banks = response.items;
      this.totalCount = response.totalCount;
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
          alert('Bank deleted successfully');
          this.fetchBanks();
        },
        error: (err) => console.error('Delete failed', err),
      });
    }
  }
}
