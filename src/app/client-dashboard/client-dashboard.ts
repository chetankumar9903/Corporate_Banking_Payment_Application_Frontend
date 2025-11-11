import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ClientSvc } from '../services/client-svc';
import { LoginSvc } from '../services/login-svc';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterModule,ReactiveFormsModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css',
})
export class ClientDashboard {
balance: number | null = null;
  private clientId: number | null = null;
  private balanceInterval: any;
  lastUpdated: Date | null = null;

  balanceForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private clientService: ClientSvc,
    private loginService: LoginSvc
  ) {
    this.balanceForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]),

    });
  }


    ngOnInit(): void {
    this.clientId = this.loginService.getClientId();

    if (this.clientId) {
      this.loadBalance(this.clientId);
      this.balanceInterval = setInterval(() => {
        this.loadBalance(this.clientId!);
      }, 20000);
    } else {
      console.error('Client ID not found');
    }
  }

  ngOnDestroy(): void {
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