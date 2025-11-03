import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BankSvc } from '../services/bank-svc';
import { CreateBankDto, UpdateBankDto } from '../models/Bank';

@Component({
  selector: 'app-bank-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bank-form.html',
  styleUrls: ['./bank-form.css'],
})
export class BankForm implements OnInit {
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

    this.bankForm = this.fb.group({
      bankName: ['', [Validators.required, Validators.maxLength(100)]],
      branch: ['', [Validators.required, Validators.maxLength(100)]],
      ifscCode: ['', [Validators.required, Validators.maxLength(15)]],
      contactNumber: ['', [Validators.required]],
      emailId: ['', [Validators.required, Validators.email]],
      userId: [null, Validators.required],
      isActive: [true],
    });

    this.loadBankUsers();
    if (this.isEditMode) this.loadBank();
  }

  loadBankUsers() {
    this.bankService.getBankUsers().subscribe({
      next: (users) => (this.bankUsers = users),
      error: (err) => console.error('Failed to load bank users', err),
    });
  }

  loadBank() {
    this.bankService.getBankById(this.bankId).subscribe({
      next: (bank) => this.bankForm.patchValue(bank),
      error: (err) => console.error('Failed to load bank', err),
    });
  }

  submit() {
    if (this.bankForm.invalid) return;
    this.loading = true;

    const formValue = this.bankForm.value;

    if (this.isEditMode) {
      const dto: UpdateBankDto = formValue;
      this.bankService.updateBank(this.bankId, dto).subscribe({
        next: () => {
          alert('Bank updated successfully');
          this.router.navigate(['/superadmin-dashboard/banks']);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.loading = false;
        },
      });
    } else {
      const dto: CreateBankDto = formValue;
      this.bankService.createBank(dto).subscribe({
        next: () => {
          alert('Bank created successfully');
          this.router.navigate(['/superadmin-dashboard/banks']);
        },
        error: (err) => {
          console.error('Creation failed', err);
          this.loading = false;
        },
      });
    }
  }
}
