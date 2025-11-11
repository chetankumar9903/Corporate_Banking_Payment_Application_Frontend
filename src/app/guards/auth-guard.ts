import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginSvc } from '../services/login-svc';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginSvc = inject(LoginSvc);

  const token = loginSvc.getToken();
  const userRole = loginSvc.getRole();

  
  if (!token || !userRole) {
    router.navigate(['/login']);
    return false;
  }


  const allowedRoles = route.data?.['roles'] as Array<string>;


  if (allowedRoles && !allowedRoles.includes(userRole)) {
   
    switch (userRole) {
      case 'SUPERADMIN':
        router.navigate(['/superadmin-dashboard']);
        break;
      case 'BANKUSER':
        router.navigate(['/bank-dashboard']);
        break;
      case 'CLIENTUSER':
        router.navigate(['/client-dashboard']);
        break;
      default:
        router.navigate(['/login']);
        break;
    }
    return false;
  }

  return true; 
};
