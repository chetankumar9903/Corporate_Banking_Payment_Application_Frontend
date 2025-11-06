import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientSvc } from '../services/client-svc';
import { LoginSvc } from '../services/login-svc';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  clientId: number | null = null;
  clientName = '';
  companyName = '';
  accountNumber = '';
  balance: number | null = null;
  isActive = false;
  customerId: number | null = null;
  bankId: number | null = null;
  bankName = '';

  balanceForm: FormGroup;
  balanceSuccess = '';
  balanceError = '';


    editMode = false;
  originalCompanyName = '';


  constructor(private clientService: ClientSvc, private loginService: LoginSvc) {
    this.clientId = this.loginService.getClientId();

    this.balanceForm = new FormGroup({
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern(/^-?\d+(\.\d{1,2})?$/),
      ]),
    });
  }

  ngOnInit(): void {
    if (this.clientId) {
      this.loadClientProfile(this.clientId);
    }
  }

  loadClientProfile(clientId: number) {
    this.clientService.getClientProfile(clientId).subscribe({
      next: (res) => {
        this.clientName = res.customerName;
        this.companyName = res.companyName;
        this.originalCompanyName = res.companyName; // new one
        this.accountNumber = res.accountNumber;
        this.balance = res.balance;
        this.isActive = res.isActive;
        this.customerId = res.customerId;
        this.bankId = res.bankId;
        this.bankName = res.bankName;
      },
      error: (err) => console.error('Error loading client profile', err),
    });
  }


   saveCompanyName() {
    if (!this.clientId) return;

    const dto = {
      companyName: this.companyName,
      isActive: this.isActive // keep same status when updating
    };

    this.clientService.updateClient(this.clientId, dto).subscribe({
      next: () => {
        this.editMode = false;
        this.originalCompanyName = this.companyName;
      },
      error: (err) => {
        alert(err.error?.message || 'Error updating company name');
        this.companyName = this.originalCompanyName;
        this.editMode = false;
      }
    });
  }

  cancelEdit() {
    this.companyName = this.originalCompanyName;
    this.editMode = false;
  }
  onUpdateBalance() {
    if (!this.balanceForm.valid || !this.clientId) return;

    const amount = parseFloat(this.balanceForm.value.amount);
    this.clientService.updateBalance(this.clientId, { amount }).subscribe({
      next: () => {
        this.balanceSuccess = 'Balance updated successfully!';
        this.balanceError = '';
        this.balanceForm.reset();
        this.loadClientProfile(this.clientId!);
        setTimeout(() => (this.balanceSuccess = ''), 3000);
      },
      error: (err) => {
        this.balanceError = err.error?.message || 'Error updating balance';
        this.balanceSuccess = '';
        setTimeout(() => (this.balanceError = ''), 5000);
      },
    });
  }



  
}
