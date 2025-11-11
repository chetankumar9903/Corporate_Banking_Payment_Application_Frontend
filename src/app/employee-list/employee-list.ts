import { Component, OnInit } from '@angular/core';
import { EmployeeDto } from '../models/Employee';
import { EmployeeSvc } from '../services/employee-svc';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginSvc } from '../services/login-svc';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  employees: EmployeeDto[] = [];
  filteredEmployees: EmployeeDto[] = [];
  loading = false;
  searchTerm = '';

  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private employeeService: EmployeeSvc, private router: Router, private loginSvc : LoginSvc) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }


  fetchEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployeesByClient().subscribe({
      next: (res) => {
        this.employees = res;
        this.filteredEmployees = res;
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }

    this.filteredEmployees.sort((a: any, b: any) => {
      const valA = a[column];
      const valB = b[column];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string') {
        return this.sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        return this.sortOrder === 'asc' 
          ? valA - valB 
          : valB - valA;
      }
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    if (this.pageNumber > this.totalPages) this.pageNumber = this.totalPages;
  }

  prevPage() {
    if (this.pageNumber > 1) this.pageNumber--;
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) this.pageNumber++;
  }

  addEmployee(): void {
    this.router.navigate(['/client-dashboard/employees/add']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/client-dashboard/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.fetchEmployees(),
      error: (err) => console.error(err)
    });
  }

   searchEmployees(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||  
      emp.emailId.toLowerCase().includes(term) ||
      emp.position?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term)
    );
      this.updatePagination();
  }
  clearFilter(): void {
  this.searchTerm = '';
  this.filteredEmployees = [...this.employees];
   this.updatePagination();
}
selectedFile: File | null = null;

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0] ?? null;
}


uploadResult: any = null;
showUploadSummary: boolean = false;

uploadCsv() {
  if (!this.selectedFile) return;

  const clientId = this.employeeService.getClientId();
   if (clientId === null) {
    alert("Client session expired. Please login again.");
    this.router.navigate(['/login']);
    return;
  }
  const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.loading = true;

  this.employeeService.uploadCsv(formData, clientId).subscribe({
    next: (res) => {
      // alert(`Employees Added: ${res.created}\n & Skipped (duplicates): ${res.skipped}`);
      // this.fetchEmployees();
      // this.selectedFile = null;

      
  this.selectedFile = null;


  this.uploadResult = res;
  this.showUploadSummary = true;
  this.fetchEmployees();
    },
    error: (err) => {
      alert(err.error?.message || "Upload failed.");
    },
    complete: () => this.loading = false
  });
}

}
