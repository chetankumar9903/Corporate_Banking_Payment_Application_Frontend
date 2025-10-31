import { Component } from '@angular/core';
import { CreateBankDto, UpdateBankDto } from '../models/Bank';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankSvc } from '../services/bank-svc';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './bank-form.html',
  styleUrl: './bank-form.css',
})
export class BankForm {
 bankForm!: FormGroup;
  bankId!: number;
  isEditMode = false;
  bankUsers: { userId: number; userName: string }[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private bankService: BankSvc,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bankId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.bankId;

    // Initialize Form
    this.bankForm = this.fb.group({
      bankName: ['', [Validators.required, Validators.maxLength(100)]],
      branch: ['', [Validators.required, Validators.maxLength(100)]],
      ifscCode: ['', [Validators.required, Validators.maxLength(15)]],
      contactNumber: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      userId: [null, Validators.required], // select from dropdown
      isActive: [true]
    });

    // Load BANKUSERs
    this.loadBankUsers();

    // Load bank data if edit mode
    if (this.isEditMode) {
      this.loadBank();
    }
  }

  loadBankUsers() {
    this.bankService.getBankUsers().subscribe({
      next: (users) => (this.bankUsers = users),
      error: (err) => console.error('Failed to load bank users', err)
    });
  }

  loadBank() {
    this.bankService.getBankById(this.bankId).subscribe({
      next: (bank) => {
        this.bankForm.patchValue({
          bankName: bank.bankName,
          branch: bank.branch,
          ifscCode: bank.ifscCode,
          contactNumber: bank.contactNumber,
          emailId: bank.emailId,
          userId: bank.userId,
          isActive: bank.isActive
        });
      },
      error: (err) => console.error('Failed to load bank', err)
    });
  }

  submit() {
    if (this.bankForm.invalid) return;
    this.loading = true;

    const formValue = this.bankForm.value;

    if (this.isEditMode) {
      const dto: UpdateBankDto = formValue;
      this.bankService.updateBank(this.bankId, dto).subscribe({
        next: () => this.router.navigate(['/superadmin-dashboard/banks']),
        error: (err) => {
          console.error('Update failed', err);
          this.loading = false;
        }
      });
    } else {
      const dto: CreateBankDto = formValue;
      this.bankService.createBank(dto).subscribe({
        next: () => this.router.navigate(['/superadmin-dashboard/banks']),
        error: (err) => {
          console.error('Creation failed', err);
          this.loading = false;
        }
      });
    }
    console.log('Bank form value:', this.bankForm.value);

  }
}
