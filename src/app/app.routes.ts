import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
import { BankDashboard } from './bank-dashboard/bank-dashboard';
import { ClientDashboard } from './client-dashboard/client-dashboard';
import { BankList } from './bank-list/bank-list';
import { BankForm } from './bank-form/bank-form';
import { Register } from './register/register';
import { ReportGenerate } from './report-generate/report-generate';
import { ReportHistory } from './report-history/report-history';
import { Report } from './report/report';
import { BeneficiaryList } from './beneficiary-list/beneficiary-list';
import { BeneficiaryForm } from './beneficiary-form/beneficiary-form';
import { PaymentList } from './payment-list/payment-list';
import { PaymentForm } from './payment-form/payment-form';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeForm } from './employee-form/employee-form';
import { Profile } from './profile/profile';
import { Salarylist } from './salarylist/salarylist';
import { SalaryCreate } from './salary-create/salary-create';
import { BatchCreate } from './batch-create/batch-create';

export const routes: Routes = [
//      { path: 'login', component: Login },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

{ path: '', component: Login },
{ path: 'login', component: Login },
 { path: 'register', component: Register },

//   { path: 'superadmin-dashboard', component: SuperadminDashboard },

 { path: 'superadmin-dashboard', component: SuperadminDashboard, children: [
    //   { path: '', redirectTo: 'banks', pathMatch: 'full' },
      { path: 'banks', component: BankList },
      { path: 'banks/add', component: BankForm },
      { path: 'banks/edit/:id', component: BankForm },
      //  { path: 'reports/generate', component: ReportGenerate },
      // { path: 'reports/history', component: ReportHistory },
      {
  path: 'reports',
  component: Report,
  children: [
    { path: 'generate', component: ReportGenerate },
    { path: 'history', component: ReportHistory },
  ]
}
    ]
  },
  { path: 'bank-dashboard', component: BankDashboard },
  // { path: 'client-dashboard', component: ClientDashboard }
  {
  path: 'client-dashboard',
  component: ClientDashboard,
  children: [
     { path: 'profile', component: Profile },
    { path: 'beneficiaries', component: BeneficiaryList },
    { path: 'beneficiaries/add', component: BeneficiaryForm },
    { path: 'beneficiaries/edit/:id', component: BeneficiaryForm },
    { path: 'payments',component: PaymentList },
    { path: 'payments/add', component: PaymentForm},
     { path: 'employees', component: EmployeeList },
   { path: 'employees/add', component: EmployeeForm },
  { path: 'employees/edit/:id', component: EmployeeForm },
  { path: 'salaries', component: Salarylist },
{ path: 'salaries/create', component: SalaryCreate},
{ path: 'salaries/batch', component: BatchCreate },


   

    // later: { path: 'reports', component: ClientReports },
  ],
}
];
