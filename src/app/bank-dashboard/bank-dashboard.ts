import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginSvc } from '../services/login-svc';
import { BankSvc } from '../services/bank-svc';

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './bank-dashboard.html',
  styleUrls: ['./bank-dashboard.css']
})
export class BankDashboard implements OnInit {
  
  isChildRouteActive = false;
  username: string | null = '';

  isLoadingBankId = true; 
  errorMessage = '';

  constructor(
    private router: Router,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc
  ) {
    this.username = localStorage.getItem('username');
    this.isChildRouteActive = this.router.url !== '/bank-dashboard';
  }

  ngOnInit(): void {
    this.findAndSaveBankId();
  }

  findAndSaveBankId(): void {
    if (this.loginSvc.getBankId()) {
      this.isLoadingBankId = false;
      return;
    }

    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      this.errorMessage = 'Could not find username. Please re-login.';
      this.isLoadingBankId = false;
      return;
    }

    this.bankSvc.getBankByUsername(currentUsername).subscribe({
      next: (bank) => {
        this.loginSvc.saveBankId(bank.bankId);
        this.isLoadingBankId = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to find your bank account.';
        console.error(err);
        this.isLoadingBankId = false;
      }
    });
  }

  onChildActivate(event: any) {
    this.isChildRouteActive = true;
  }

  onChildDeactivate(event: any) {
    this.isChildRouteActive = false;
  }
}