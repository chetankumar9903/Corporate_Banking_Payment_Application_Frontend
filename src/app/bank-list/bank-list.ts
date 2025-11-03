import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BankSvc } from '../services/bank-svc';
import { Bank } from '../models/Bank';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-list.html',
  styleUrls: ['./bank-list.css'],
})
export class BankList implements OnInit {
  banks: Bank[] = [];
  loading = false;

   // new properties for filters
  searchTerm = '';
  sortColumn = 'bankName';
  sortOrder: 'asc' | 'desc' = 'asc';
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;

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



// fetchBanks(): void {
//   this.loading = true;
//   this.bankService.getAllBanks().subscribe({
//     next: (response) => {
//       this.banks = response.items;
//       this.totalCount = response.totalCount;
//       this.loading = false;
//     },
//     error: (err) => {
//       console.error('Failed to fetch banks', err);
//       this.loading = false;
//     }
//   });
// }


  fetchBanks(): void {
    this.loading = true;
    this.bankService
      .getAllBanks(this.searchTerm, this.sortColumn, this.sortOrder, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          this.banks = response.items;
          this.totalCount = response.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch banks', err);
          this.loading = false;
        },
      });
  }

  search(): void {
    this.pageNumber = 1;
    this.fetchBanks();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.fetchBanks();
  }

   clearFilters(): void {
    this.searchTerm = '';
    this.sortColumn = 'bankName';
    this.sortOrder = 'asc';
    this.pageNumber = 1;
    this.pageSize = 5;
    this.fetchBanks();
  }


  nextPage(): void {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.pageNumber++;
      this.fetchBanks();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchBanks();
    }
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
