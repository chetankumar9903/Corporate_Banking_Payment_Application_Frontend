import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BeneficiarySvc } from '../services/beneficiary-svc';
import { Beneficiary } from '../models/Beneficiary';


@Component({
  selector: 'app-beneficiary-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficiary-list.html',
  styleUrls: ['./beneficiary-list.css'],
})
export class BeneficiaryList implements OnInit {
  beneficiaries: Beneficiary[] = [];
  searchTerm = '';
  sortColumn = 'beneficiaryName';
  sortOrder: 'asc' | 'desc' = 'asc';
  loading = false;
  clientId!: number;

   pageNumber = 1;
  pageSize = 10;
  totalCount = 0;


  constructor(private svc: BeneficiarySvc, private router: Router) {}

  // ngOnInit(): void {
  //   this.load();
  // }

  ngOnInit(): void {
    const storedId = localStorage.getItem('clientId');
    if (storedId) this.clientId = +storedId;
    this.load();
  }

  // load() {
  //   this.loading = true;
  //   this.svc.getAll(this.searchTerm, this.sortColumn, this.sortOrder).subscribe({
  //     next: (data) => {
  //       this.beneficiaries = data.items;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.loading = false;
  //     },
  //   });
  // }

   load() {
    if (!this.clientId) return;
    this.loading = true;
    this.svc.getByClientId(this.clientId).subscribe({
      next: (data) => {
        this.beneficiaries = data;
         this.totalCount = data.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load beneficiaries', err);
        this.loading = false;
      },
    });
  }

  search() {
    if (!this.searchTerm) {
    this.load();
     this.pageNumber = 1;
    return;
  }
  this.beneficiaries = this.beneficiaries.filter(b =>
    b.beneficiaryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    b.bankName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    b.accountNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
  }

  clearFilter() {
    this.searchTerm = '';
    this.sortColumn = 'beneficiaryName';
    this.sortOrder = 'asc';
     this.pageNumber = 1;
    this.load();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.load();
  }

   add() {
    this.router.navigate(['/client-dashboard/beneficiaries/add']);
  }

  edit(id: number) {
    this.router.navigate(['/client-dashboard/beneficiaries/edit', id]);
  }

  delete(id: number) {
    if (confirm('Delete this beneficiary?')) {
      this.svc.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Delete failed', err),
      });
    }
  }

   // Pagination helpers
  get totalPages() {
    // return Math.ceil(this.totalCount / this.pageSize);
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }
  prevPage() { if (this.pageNumber > 1) { this.pageNumber--; this.load(); } }
  nextPage() { if (this.pageNumber < this.totalPages) { this.pageNumber++; this.load(); } }

  // Update paged list if you want frontend pagination
get pagedBeneficiaries() {
  const start = (this.pageNumber - 1) * this.pageSize;
  return this.beneficiaries.slice(start, start + this.pageSize);
} 

}
