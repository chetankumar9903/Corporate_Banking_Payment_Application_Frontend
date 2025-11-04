import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { ClientSvc } from '../../services/client.svc';
import { LoginSvc } from '../../services/login-svc';
import { CreateClientDto } from '../../models/Client';
import { ClientSvc } from '../../services/client-svc';

@Component({
  selector: 'app-create-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-client-form.html',
  styleUrls: ['./create-client-form.css']
})
export class CreateClientFormComponent implements OnInit {

  clientForm!: FormGroup;
  
  // State
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // IDs
  private customerId!: number;
  private bankId!: number;

  constructor(
    private fb: FormBuilder,
    private clientSvc: ClientSvc,
    private loginSvc: LoginSvc,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Get CustomerID from the URL (passed from verification page)
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (!idFromRoute) {
      this.errorMessage = 'No Customer ID was provided.';
      return;
    }
    this.customerId = +idFromRoute;

    // 2. Get BankID from the logged-in user
    const idFromLogin = this.loginSvc.getBankId();
    if (!idFromLogin) {
      this.errorMessage = 'Could not find your Bank ID. Please re-login.';
      return;
    }
    this.bankId = idFromLogin;

    // 3. Initialize the form
    this.clientForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      initialBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const formValue = this.clientForm.value;

    // 4. Build the DTO
    const clientDto: CreateClientDto = {
      customerId: this.customerId,
      bankId: this.bankId,
      companyName: formValue.companyName,
      initialBalance: +formValue.initialBalance
    };

    // 5. Call the Client service
    this.clientSvc.createClient(clientDto).subscribe({
      next: (newClient) => {
        this.loading = false;
        this.successMessage = `Successfully created client: ${newClient.companyName} with account number: ${newClient.accountNumber}`;
        
        // Disable the form after successful submission
        this.clientForm.disable();

        // Redirect back to the verification page after a short delay
        setTimeout(() => {
          this.router.navigate(['/bank-dashboard/verification']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to create the client account.';
        }
        console.error(err);
      }
    });
  }
}