import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SalarySvc } from '../services/salary-svc';
import { LoginSvc } from '../services/login-svc';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salarylist',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe,FormsModule],
  templateUrl: './salarylist.html',
  styleUrl: './salarylist.css',
})
export class Salarylist implements OnInit {
  salaries: any[] = [];
  loading = false;
  clientId: number | null = null;

  
  // Pagination & sorting
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  sortColumn = 'date';
  sortOrder: 'asc'|'desc' = 'desc';
  searchTerm = '';

  constructor(private svc: SalarySvc, private login: LoginSvc) {
    this.clientId = this.login.getClientId();
  }

  ngOnInit(): void {
    if (!this.clientId) return;
    this.load();
  }

  // load() {
  //   this.loading = true;
  //   this.svc.getByClientId(this.clientId!).subscribe({
  //     next: (res) => { this.salaries = res; this.loading = false; },
  //     error: () => { this.loading = false; alert('Failed to load salaries'); }
  //   });
  // }


  load() {
    if (!this.clientId) return;
    this.loading = true;
    this.svc.getAll(
      this.clientId,
      this.searchTerm,
      this.sortColumn,
      this.sortOrder,
      this.pageNumber,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.salaries = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to load salaries');
      }
    });
  }


  onDelete(id: number) {
    if (!confirm('Delete this salary record?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.salaries = this.salaries.filter(s => s.salaryDisbursementId !== id); },
      error: () => alert('Failed to delete')
    });
  }

   // Pagination
  goToPage(page: number) {
    if (page < 1 || page > Math.ceil(this.totalCount / this.pageSize)) return;
    this.pageNumber = page;
    this.load();
  }

  // Sorting
  setSort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.load();
  }

  // Search
  onSearch(term: string) {
    this.searchTerm = term;
    this.pageNumber = 1;
    this.load();
  }

  get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize);
}

clearSearch() {
  this.searchTerm = '';
  this.onSearch('');
}
}
