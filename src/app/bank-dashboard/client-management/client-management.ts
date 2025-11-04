import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { ClientSvc } from '../../services/client.svc';
import { Client } from '../../models/Client';
import { LoginSvc } from '../../services/login-svc';
import { BankSvc } from '../../services/bank-svc';
import { ClientSvc } from '../../services/client-svc';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule],
  templateUrl: './client-management.html',
  styleUrls: ['./client-management.css']
})
export class ClientManagementComponent implements OnInit {

  // --- (All properties are unchanged) ---
  public allClients: Client[] = [];
  public filteredClients: Client[] = [];
  public clients: Client[] = [];
  public Math = Math;
  public loading = false;
  public errorMessage = '';
  public currentPage = 1;
  public pageSize = 10;
  private bankId!: number;
  private bankName: string = '';
  public clientSearchTerm: string = '';
  public sortColumn: string = 'companyName';
  public sortOrder: 'ASC' | 'DESC' = 'ASC';

  constructor(
    private clientSvc: ClientSvc,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.loginSvc.getBankId();
    if (!id) {
      this.errorMessage = "Could not verify your Bank. Please re-login.";
      return;
    }
    this.bankId = id;
    this.loading = true;

    this.bankSvc.getBankById(this.bankId).subscribe({
      next: (bank) => {
        this.bankName = bank.bankName;
        this.loadAllClients(); 
      },
      error: (err) => {
        this.errorMessage = "Could not find your bank details.";
        this.loading = false;
      }
    });
  }

  loadAllClients(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // We get all clients for our bank (using bankName)
    this.clientSvc.getAllClients(1, 1000, this.sortColumn, this.sortOrder, this.bankName).subscribe({
      next: (result) => {
        this.allClients = result.items; 
        this.applyFiltersAndPagination(); 
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load clients.';
        console.error(err);
        this.loading = false;
      }
    });
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

  /**
   * --- THIS IS THE UPDATED FUNCTION ---
   * It now searches across multiple fields, just like your backend.
   */
  applyFiltersAndPagination(): void {
    let tempClients = [...this.allClients];

    // 1. Filter by Generic Search Term
    const searchTerm = this.clientSearchTerm.toLowerCase();
    if (searchTerm) {
      tempClients = tempClients.filter(c => 
        (c.companyName && c.companyName.toLowerCase().includes(searchTerm)) ||
        (c.accountNumber && c.accountNumber.toLowerCase().includes(searchTerm)) ||
        (c.customerName && c.customerName.toLowerCase().includes(searchTerm))
        // Add any other fields you want to search here
      );
    }

    // 2. Sort the filtered list
    tempClients.sort((a, b) => {
      const aVal = (a as any)[this.sortColumn] || ''; 
      const bVal = (b as any)[this.sortColumn] || '';

      let comparison = 0;
      if (aVal > bVal) {
        comparison = 1;
      } else if (aVal < bVal) {
        comparison = -1;
      }
      return this.sortOrder === 'ASC' ? comparison : -comparison;
    });

    this.filteredClients = tempClients;

    // 3. Apply pagination to the filtered list
    this.updatePagedClients();
  }

  updatePagedClients(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.clients = this.filteredClients.slice(startIndex, endIndex);
  }

  onDelete(client: Client): void {
    if (!confirm(`Are you sure you want to delete client ${client.companyName}? This action cannot be undone.`)) {
      return;
    }

    this.loading = true;
    this.clientSvc.deleteClient(client.clientId).subscribe({
      next: () => {
        this.allClients = this.allClients.filter(c => c.clientId !== client.clientId);
        this.applyFiltersAndPagination();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = `Failed to delete client ${client.companyName}.`;
        console.error(err);
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if ((this.currentPage * this.pageSize) < this.filteredClients.length) {
      this.currentPage++;
      this.updatePagedClients();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedClients();
    }
  }
}