import { Component, OnInit } from '@angular/core';
import { EmployeeDto } from '../models/Employee';
import { EmployeeSvc } from '../services/employee-svc';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private employeeService: EmployeeSvc, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  // fetchEmployees(): void {
  //   this.loading = true;
  //   this.employeeService.getEmployeesByClient().subscribe({
  //     next: (res) => { this.employees = res; this.loading = false; },
  //     error: (err) => { console.error(err); this.loading = false; }
  //   });
  // }

  fetchEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployeesByClient().subscribe({
      next: (res) => {
        this.employees = res;
        this.filteredEmployees = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
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
      // emp.lastName.toLowerCase().includes(term) ||
      emp.emailId.toLowerCase().includes(term) ||
      emp.position?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term)
    );
  }
  clearFilter(): void {
  this.searchTerm = '';
  this.filteredEmployees = [...this.employees];
}
}
