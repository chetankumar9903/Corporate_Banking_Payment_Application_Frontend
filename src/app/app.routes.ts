import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
import { BankDashboard } from './bank-dashboard/bank-dashboard';
import { ClientDashboard } from './client-dashboard/client-dashboard';
import { BankList } from './bank-list/bank-list';
import { BankForm } from './bank-form/bank-form';
import { CustomerOnboardingComponent } from './bank-dashboard/customer-onboarding/customer-onboarding';
import { CustomerVerificationComponent } from './bank-dashboard/customer-verification/customer-verification';
import { CreateClientFormComponent } from './bank-dashboard/create-client-form/create-client-form';
import { ClientManagementComponent } from './bank-dashboard/client-management/client-management';
import { PaymentApprovalComponent } from './bank-dashboard/payment-approval/payment-approval';
import { AllTransactionsComponent } from './bank-dashboard/all-transactions/all-transactions';
import { ReportGenerationComponent } from './bank-dashboard/report-generation/report-generation';


export const routes: Routes = [
  { path: '', component: Login },
  
  { 
    path: 'superadmin-dashboard', 
    component: SuperadminDashboard, 
    children: [
      { path: '', redirectTo: 'banks', pathMatch: 'full' }, 
      { path: 'banks', component: BankList },
      { path: 'banks/add', component: BankForm },
      { path: 'banks/edit/:id', component: BankForm }
    ]
  },
  
  { 
    path: 'bank-dashboard', 
    component: BankDashboard,
    children: [
      // { path: '', redirectTo: 'verification', pathMatch: 'full' }, // <-- REMOVE THIS LINE
      { path: 'onboarding', component: CustomerOnboardingComponent },
      { path: 'verification', component: CustomerVerificationComponent },
      { path: 'create-client/:id', component: CreateClientFormComponent },
      { path: 'manage-clients', component: ClientManagementComponent },
      { path: 'payment-approval', component: PaymentApprovalComponent },
      { path: 'all-transactions', component: AllTransactionsComponent },
      { path: 'reports', component: ReportGenerationComponent }

    ]
  },
  
  { path: 'client-dashboard', component: ClientDashboard }
];