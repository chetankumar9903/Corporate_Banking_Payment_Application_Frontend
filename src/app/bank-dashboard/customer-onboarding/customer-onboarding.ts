import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { UserSvc } from '../../services/user.svc';
// import { CustomerSvc } from '../../services/customer.svc';
// import { DocumentSvc } from '../../services/document.svc';
import { LoginSvc } from '../../services/login-svc';
import { UserDto } from '../../models/User';
import { CreateCustomerDto } from '../../models/Customer';
import { switchMap } from 'rxjs/operators';
import { UserSvc } from '../../services/user-svc';
import { CustomerSvc } from '../../services/customer-svc';
import { DocumentSvc } from '../../services/document-svc';

@Component({
  selector: 'app-customer-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-onboarding.html',
  styleUrls: ['./customer-onboarding.css']
})
export class CustomerOnboardingComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // 1. Declare the form property with '!'
  onboardingForm!: FormGroup; 

  availableUsers: UserDto[] = [];
  selectedFile: File | null = null;
  
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  private bankId!: number;

  documentTypes = ['AADHAR CARD','PAN CARD','PASSPORT','DRIVING LISCENCE','VOTER ID','BIRTH CIRTIFICATE','ELECTRICITY BILL','TELEPHONE BILL','OTHERS'];

  constructor(
    private fb: FormBuilder, // fb is injected here
    private userSvc: UserSvc,
    private customerSvc: CustomerSvc,
    private documentSvc: DocumentSvc,
    private loginSvc: LoginSvc,
    private router: Router
  ) {
    // 2. Initialize the form INSIDE the constructor
    this.onboardingForm = this.fb.group({
      userId: [null, [Validators.required]],
      documentType: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    // 3. Get the logged-in Bank User's bankId
    const id = this.loginSvc.getBankId();
    
    // 4. Set default form values
    this.onboardingForm.patchValue({
      documentType: this.documentTypes[0]
    });

    if (!id) {
      // 5. If no ID, set error and disable the form
      this.errorMessage = 'Could not find your Bank ID. Please re-login.';
      this.onboardingForm.disable(); // Disable the form
      return;
    }
    
    // 6. If we have an ID, proceed
    this.bankId = id;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userSvc.getAvailableClientUsers().subscribe({
      next: (users) => {
        // --- THIS IS THE FIX FOR THE EMPTY DROPDOWN ---
        // Ensure you are filtering by the correct case
        this.availableUsers = users.filter(user => 
          user.userRole.toString().toUpperCase() === 'CLIENTUSER' && user.isActive
        );
        // --- END OF FIX ---
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load available users.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = ''; 
    }
  }

  onSubmit(): void {
    if (this.onboardingForm.invalid) {
      this.errorMessage = 'Please select a user and document type.';
      return;
    }
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.onboardingForm.value;

    const customerDto: CreateCustomerDto = {
      userId: +formValue.userId,
      bankId: this.bankId
    };

    this.customerSvc.createCustomer(customerDto).pipe(
      switchMap(newCustomer => {
        this.successMessage = `Customer ${newCustomer.userName} created. Uploading document...`;
        
        return this.documentSvc.uploadDocument(
          newCustomer.customerId,
          formValue.documentType,
          this.selectedFile!
        );
      })
    ).subscribe({
      next: (uploadedDoc) => {
        this.loading = false;
        this.successMessage = `Successfully onboarded user and uploaded document: ${uploadedDoc.documentName}`;
        
        this.onboardingForm.reset({ documentType: this.documentTypes[0] });
        this.selectedFile = null;
        this.fileInput.nativeElement.value = ''; 

        setTimeout(() => {
          this.router.navigate(['/bank-dashboard/verification']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Onboarding failed. The user might already be a customer.';
        }
        console.error(err);
      }
    });
  }
}