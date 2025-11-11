import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
import { BankList } from './bank-list/bank-list';
import { BankForm } from './bank-form/bank-form';
import { SuperadminReportsComponent } from './superadmin-reports/superadmin-reports';
import { BankDashboard } from './bank-dashboard/bank-dashboard';
import { CustomerOnboardingComponent } from './bank-dashboard/customer-onboarding/customer-onboarding';
import { CustomerVerificationComponent } from './bank-dashboard/customer-verification/customer-verification';
import { CreateClientFormComponent } from './bank-dashboard/create-client-form/create-client-form';
import { ClientManagementComponent } from './bank-dashboard/client-management/client-management';
import { PaymentApprovalComponent } from './bank-dashboard/payment-approval/payment-approval';
import { AllTransactionsComponent } from './bank-dashboard/all-transactions/all-transactions';
import { ReportGenerationComponent } from './bank-dashboard/report-generation/report-generation';
import { ClientDashboard } from './client-dashboard/client-dashboard';
import { Profile } from './profile/profile';
import { BeneficiaryList } from './beneficiary-list/beneficiary-list';
import { BeneficiaryForm } from './beneficiary-form/beneficiary-form';
import { PaymentList } from './payment-list/payment-list';
import { PaymentForm } from './payment-form/payment-form';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeForm } from './employee-form/employee-form';
import { Salarylist } from './salarylist/salarylist';
import { SalaryCreate } from './salary-create/salary-create';
import { BatchCreate } from './batch-create/batch-create';
import { ClientReportsComponent } from './client-reports/client-reports';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'superadmin-dashboard',
    component: SuperadminDashboard,
canActivate: [authGuard],
  data: { roles: ['SUPERADMIN'] },
    children: [
      { path: '', redirectTo: 'banks', pathMatch: 'full' },
      { path: 'banks', component: BankList },
      { path: 'banks/add', component: BankForm },
      { path: 'banks/edit/:id', component: BankForm },
      
      
      { path: 'reports', component: SuperadminReportsComponent }
    ],
  },

  {
    path: 'bank-dashboard',
    component: BankDashboard,
 canActivate: [authGuard],
  data: { roles: ['BANKUSER'] },
    children: [
      { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
      { path: 'onboarding', component: CustomerOnboardingComponent },
      { path: 'verification', component: CustomerVerificationComponent },
      { path: 'create-client/:id', component: CreateClientFormComponent },
      { path: 'manage-clients', component: ClientManagementComponent },
      { path: 'payment-approval', component: PaymentApprovalComponent },
      { path: 'all-transactions', component: AllTransactionsComponent },
      { path: 'reports', component: ReportGenerationComponent },
    ],
  },


  {
    path: 'client-dashboard',
    component: ClientDashboard,
 canActivate: [authGuard],
  data: { roles: ['CLIENTUSER'] },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: Profile },
      { path: 'beneficiaries', component: BeneficiaryList },
      { path: 'beneficiaries/add', component: BeneficiaryForm },
      { path: 'beneficiaries/edit/:id', component: BeneficiaryForm },
      { path: 'payments', component: PaymentList },
      { path: 'payments/add', component: PaymentForm },
      { path: 'employees', component: EmployeeList },
      { path: 'employees/add', component: EmployeeForm },
      { path: 'employees/edit/:id', component: EmployeeForm },
      { path: 'salaries', component: Salarylist },
      { path: 'salaries/create', component: SalaryCreate },
      { path: 'salaries/batch', component: BatchCreate },
      { path: 'reports', component: ClientReportsComponent }
    ],
  },

  { path: '**', redirectTo: 'login' },
];