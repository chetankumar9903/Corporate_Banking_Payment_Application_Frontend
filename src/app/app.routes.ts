// // import { Routes } from '@angular/router';
// // import { Login } from './login/login';
// // import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
// // import { BankDashboard } from './bank-dashboard/bank-dashboard';
// // import { ClientDashboard } from './client-dashboard/client-dashboard';
// // import { BankList } from './bank-list/bank-list';
// // import { BankForm } from './bank-form/bank-form';
// // import { CustomerOnboardingComponent } from './bank-dashboard/customer-onboarding/customer-onboarding';
// // import { CustomerVerificationComponent } from './bank-dashboard/customer-verification/customer-verification';
// // import { CreateClientFormComponent } from './bank-dashboard/create-client-form/create-client-form';
// // import { ClientManagementComponent } from './bank-dashboard/client-management/client-management';
// // import { PaymentApprovalComponent } from './bank-dashboard/payment-approval/payment-approval';
// // import { AllTransactionsComponent } from './bank-dashboard/all-transactions/all-transactions';
// // import { ReportGenerationComponent } from './bank-dashboard/report-generation/report-generation';
// // import { ReportGenerate } from './report-generate/report-generate';
// // import { ReportHistory } from './report-history/report-history';


// // export const routes: Routes = [
// //   { path: '', component: Login },
  
// //   { 
// //     path: 'superadmin-dashboard', 
// //     component: SuperadminDashboard, 
// //     children: [
// //       { path: '', redirectTo: 'banks', pathMatch: 'full' }, 
// // // import { Register } from './register/register';
// // // import { ReportGenerate } from './report-generate/report-generate';
// // // import { ReportHistory } from './report-history/report-history';
// // // import { Report } from './report/report';
// // // import { BeneficiaryList } from './beneficiary-list/beneficiary-list';
// // // import { BeneficiaryForm } from './beneficiary-form/beneficiary-form';
// // // import { PaymentList } from './payment-list/payment-list';
// // // import { PaymentForm } from './payment-form/payment-form';
// // // import { EmployeeList } from './employee-list/employee-list';
// // // import { EmployeeForm } from './employee-form/employee-form';
// // // import { Profile } from './profile/profile';
// // // import { Salarylist } from './salarylist/salarylist';
// // // import { SalaryCreate } from './salary-create/salary-create';
// // // import { BatchCreate } from './batch-create/batch-create';

// // export const routes: Routes = [
// // //      { path: 'login', component: Login },
// // //   { path: '', redirectTo: 'login', pathMatch: 'full' },

// // { path: '', component: Login },
// // { path: 'login', component: Login },
// //  { path: 'register', component: Register },

// // //   { path: 'superadmin-dashboard', component: SuperadminDashboard },

// //  { path: 'superadmin-dashboard', component: SuperadminDashboard, children: [
// //     //   { path: '', redirectTo: 'banks', pathMatch: 'full' },
// //       { path: 'banks', component: BankList },
// //       { path: 'banks/add', component: BankForm },
// //       { path: 'banks/edit/:id', component: BankForm },
// //       //  { path: 'reports/generate', component: ReportGenerate },
// //       // { path: 'reports/history', component: ReportHistory },
// //       {
// //   path: 'reports',
// //   component: Report,
// //   children: [
// //     { path: 'generate', component: ReportGenerate },
// //     { path: 'history', component: ReportHistory },
// //   ]
// // }
// //     ]
// //   },
  
// //   { 
// //     path: 'bank-dashboard', 
// //     component: BankDashboard,
// //     children: [
// //       // { path: '', redirectTo: 'verification', pathMatch: 'full' }, // <-- REMOVE THIS LINE
// //       { path: 'onboarding', component: CustomerOnboardingComponent },
// //       { path: 'verification', component: CustomerVerificationComponent },
// //       { path: 'create-client/:id', component: CreateClientFormComponent },
// //       { path: 'manage-clients', component: ClientManagementComponent },
// //       { path: 'payment-approval', component: PaymentApprovalComponent },
// //       { path: 'all-transactions', component: AllTransactionsComponent },
// //       { path: 'reports', component: ReportGenerationComponent }

// //     ]
// //   },
  
// //   { path: 'client-dashboard', component: ClientDashboard }
// // ];
// //   { path: 'bank-dashboard', component: BankDashboard },
// //   // { path: 'client-dashboard', component: ClientDashboard }
// //   {
// //   path: 'client-dashboard',
// //   component: ClientDashboard,
// //   children: [
// //      { path: 'profile', component: Profile },
// //     { path: 'beneficiaries', component: BeneficiaryList },
// //     { path: 'beneficiaries/add', component: BeneficiaryForm },
// //     { path: 'beneficiaries/edit/:id', component: BeneficiaryForm },
// //     { path: 'payments',component: PaymentList },
// //     { path: 'payments/add', component: PaymentForm},
// //      { path: 'employees', component: EmployeeList },
// //    { path: 'employees/add', component: EmployeeForm },
// //   { path: 'employees/edit/:id', component: EmployeeForm },
// //   { path: 'salaries', component: Salarylist },
// // { path: 'salaries/create', component: SalaryCreate},
// // { path: 'salaries/batch', component: BatchCreate },


   

// //     // later: { path: 'reports', component: ClientReports },
// //   ],
// // }
// // ];


// import { Routes } from '@angular/router';

// // --- Auth ---
// import { Login } from './login/login';
// import { Register } from './register/register';

// // --- Super Admin ---
// import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
// import { BankList } from './bank-list/bank-list';
// import { BankForm } from './bank-form/bank-form';
// import { Report } from './report/report';
// // import { ReportGenerate } from './report-generate/report-generate';
// // import { ReportHistory } from './report-history/report-history';

// // --- Bank Dashboard ---
// import { BankDashboard } from './bank-dashboard/bank-dashboard';
// import { CustomerOnboardingComponent } from './bank-dashboard/customer-onboarding/customer-onboarding';
// import { CustomerVerificationComponent } from './bank-dashboard/customer-verification/customer-verification';
// import { CreateClientFormComponent } from './bank-dashboard/create-client-form/create-client-form';
// import { ClientManagementComponent } from './bank-dashboard/client-management/client-management';
// import { PaymentApprovalComponent } from './bank-dashboard/payment-approval/payment-approval';
// import { AllTransactionsComponent } from './bank-dashboard/all-transactions/all-transactions';
// import { ReportGenerationComponent } from './bank-dashboard/report-generation/report-generation';

// // --- Client Dashboard ---
// import { ClientDashboard } from './client-dashboard/client-dashboard';
// import { Profile } from './profile/profile';
// import { BeneficiaryList } from './beneficiary-list/beneficiary-list';
// import { BeneficiaryForm } from './beneficiary-form/beneficiary-form';
// import { PaymentList } from './payment-list/payment-list';
// import { PaymentForm } from './payment-form/payment-form';
// import { EmployeeList } from './employee-list/employee-list';
// import { EmployeeForm } from './employee-form/employee-form';
// import { Salarylist } from './salarylist/salarylist';
// import { SalaryCreate } from './salary-create/salary-create';
// import { BatchCreate } from './batch-create/batch-create';
// import { SuperadminReportsComponent } from './superadmin-reports/superadmin-reports';

// export const routes: Routes = [
//   // -------------------------------
//   // Default / Auth Routes
//   // -------------------------------
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: Login },
//   { path: 'register', component: Register },

//   // -------------------------------
//   // Superadmin Dashboard
//   // -------------------------------
//   {
//     path: 'superadmin-dashboard',
//     component: SuperadminDashboard,
//     children: [
//       { path: '', redirectTo: 'banks', pathMatch: 'full' },
//       { path: 'banks', component: BankList },
//       { path: 'banks/add', component: BankForm },
//       { path: 'banks/edit/:id', component: BankForm },
//       {
//         // path: 'reports',
//         // component: Report,
//         // children: [
//         //   // { path: 'generate', component: ReportGenerate },
//         //   // { path: 'history', component: ReportHistory },
//         // ],
//       },
//       { path: 'reports', component: SuperadminReportsComponent }
//     ],
//   },

//   // -------------------------------
//   // Bank Dashboard
//   // -------------------------------
//   {
//     path: 'bank-dashboard',
//     component: BankDashboard,
//     children: [
//       { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
//       { path: 'onboarding', component: CustomerOnboardingComponent },
//       { path: 'verification', component: CustomerVerificationComponent },
//       { path: 'create-client/:id', component: CreateClientFormComponent },
//       { path: 'manage-clients', component: ClientManagementComponent },
//       { path: 'payment-approval', component: PaymentApprovalComponent },
//       { path: 'all-transactions', component: AllTransactionsComponent },
//       { path: 'reports', component: ReportGenerationComponent },
//     ],
//   },

//   // -------------------------------
//   // Client Dashboard
//   // -------------------------------
//   {
//     path: 'client-dashboard',
//     component: ClientDashboard,
//     children: [
//       { path: '', redirectTo: 'profile', pathMatch: 'full' },
//       { path: 'profile', component: Profile },
//       { path: 'beneficiaries', component: BeneficiaryList },
//       { path: 'beneficiaries/add', component: BeneficiaryForm },
//       { path: 'beneficiaries/edit/:id', component: BeneficiaryForm },
//       { path: 'payments', component: PaymentList },
//       { path: 'payments/add', component: PaymentForm },
//       { path: 'employees', component: EmployeeList },
//       { path: 'employees/add', component: EmployeeForm },
//       { path: 'employees/edit/:id', component: EmployeeForm },
//       { path: 'salaries', component: Salarylist },
//       { path: 'salaries/create', component: SalaryCreate },
//       { path: 'salaries/batch', component: BatchCreate },
//     ],
//   },

//   // -------------------------------
//   // Fallback
//   // -------------------------------
//   { path: '**', redirectTo: 'login' },
// ];
import { Routes } from '@angular/router';

// --- Auth ---
import { Login } from './login/login';
import { Register } from './register/register';

// --- Super Admin ---
import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
import { BankList } from './bank-list/bank-list';
import { BankForm } from './bank-form/bank-form';
import { SuperadminReportsComponent } from './superadmin-reports/superadmin-reports';

// --- Bank Dashboard ---
import { BankDashboard } from './bank-dashboard/bank-dashboard';
import { CustomerOnboardingComponent } from './bank-dashboard/customer-onboarding/customer-onboarding';
import { CustomerVerificationComponent } from './bank-dashboard/customer-verification/customer-verification';
import { CreateClientFormComponent } from './bank-dashboard/create-client-form/create-client-form';
import { ClientManagementComponent } from './bank-dashboard/client-management/client-management';
import { PaymentApprovalComponent } from './bank-dashboard/payment-approval/payment-approval';
import { AllTransactionsComponent } from './bank-dashboard/all-transactions/all-transactions';
import { ReportGenerationComponent } from './bank-dashboard/report-generation/report-generation';

// --- Client Dashboard ---
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


export const routes: Routes = [
  // -------------------------------
  // Default / Auth Routes
  // -------------------------------
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // -------------------------------
  // Superadmin Dashboard
  // -------------------------------
  {
    path: 'superadmin-dashboard',
    component: SuperadminDashboard,
    children: [
      { path: '', redirectTo: 'banks', pathMatch: 'full' },
      { path: 'banks', component: BankList },
      { path: 'banks/add', component: BankForm },
      { path: 'banks/edit/:id', component: BankForm },
      
      // --- THIS IS THE FIX ---
      // The empty, commented-out block was removed from here.
      // --- END OF FIX ---
      
      { path: 'reports', component: SuperadminReportsComponent }
    ],
  },

  // -------------------------------
  // Bank Dashboard
  // -------------------------------
  {
    path: 'bank-dashboard',
    component: BankDashboard,
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

  // -------------------------------
  // Client Dashboard
  // -------------------------------
  {
    path: 'client-dashboard',
    component: ClientDashboard,
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

  // -------------------------------
  // Fallback
  // -------------------------------
  { path: '**', redirectTo: 'login' },
];