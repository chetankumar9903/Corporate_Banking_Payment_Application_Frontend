import { Routes } from '@angular/router';
import { Login } from './login/login';
import { SuperadminDashboard } from './superadmin-dashboard/superadmin-dashboard';
import { BankDashboard } from './bank-dashboard/bank-dashboard';
import { ClientDashboard } from './client-dashboard/client-dashboard';
import { BankList } from './bank-list/bank-list';
import { BankForm } from './bank-form/bank-form';
import { Register } from './register/register';

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
      { path: 'banks/edit/:id', component: BankForm }
    ]
  },
  { path: 'bank-dashboard', component: BankDashboard },
  { path: 'client-dashboard', component: ClientDashboard }
];
