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

  // State flags to control the UI
  isLoadingBankId = true; // Show loading screen by default
  errorMessage = '';      // Show error message if fetch fails

  constructor(
    private router: Router,
    private loginSvc: LoginSvc,
    private bankSvc: BankSvc
  ) {
    this.username = localStorage.getItem('username');
    this.isChildRouteActive = this.router.url !== '/bank-dashboard';
  }

  ngOnInit(): void {
    // This function will run when the dashboard loads
    this.findAndSaveBankId();
  }

  /**
   * This function checks if the bankId is in localStorage.
   * If not, it fetches it using the new API endpoint.
   */
  findAndSaveBankId(): void {
    // 1. Check if bankId is already in localStorage. If yes, we're done.
    if (this.loginSvc.getBankId()) {
      this.isLoadingBankId = false;
      return;
    }

    // 2. If not, get the logged-in username
    const currentUsername = localStorage.getItem('username');
    if (!currentUsername) {
      this.errorMessage = 'Could not find username. Please re-login.';
      this.isLoadingBankId = false;
      return;
    }

    // 3. Call our new, efficient endpoint
    this.bankSvc.getBankByUsername(currentUsername).subscribe({
      next: (bank) => {
        // 4. SUCCESS! Save the bankId and hide the loading screen.
        this.loginSvc.saveBankId(bank.bankId);
        this.isLoadingBankId = false;
      },
      error: (err) => {
        // 5. ERROR! Show the error message from the backend.
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