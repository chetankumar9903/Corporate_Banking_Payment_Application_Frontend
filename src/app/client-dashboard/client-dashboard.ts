import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ClientSvc } from '../services/client-svc';
import { LoginSvc } from '../services/login-svc';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard {
balance: number | null = null;
  private clientId: number | null = null;
  private balanceInterval: any;
  lastUpdated: Date | null = null;

  constructor(
    private clientService: ClientSvc,
    private loginService: LoginSvc
  ) {}

  // ngOnInit(): void {
  //   const clientId = this.loginService.getClientId();
  //   if (clientId) {
  //     this.loadBalance(clientId);
  //   } else {
  //     console.error('Client ID not found');
  //   }
  // }

  // loadBalance(clientId: number): void {
  //   this.clientService.getBalance(clientId).subscribe({
  //     next: (res) => this.balance = res.balance,
  //     error: (err) => console.error('Error fetching balance', err)
  //   });
  // }

    ngOnInit(): void {
    this.clientId = this.loginService.getClientId();

    if (this.clientId) {
      this.loadBalance(this.clientId);

      // Auto-refresh every 20 seconds
      this.balanceInterval = setInterval(() => {
        this.loadBalance(this.clientId!);
      }, 20000);
    } else {
      console.error('Client ID not found');
    }
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed to prevent memory leaks
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval);
    }
  }

  loadBalance(clientId: number): void {
  this.clientService.getBalance(clientId).subscribe({
    next: (res) => {
      this.balance = res.balance;
      this.lastUpdated = new Date();
    },
    error: (err) => console.error('Error fetching balance', err)
  });
}
}