import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginSvc } from '../services/login-svc';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginSvc = inject(LoginSvc);

  const token = loginSvc.getToken();
  const userRole = loginSvc.getRole();

  // Not logged in - redirect
  if (!token || !userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Get allowed roles from route data
  const allowedRoles = route.data?.['roles'] as Array<string>;

  // If route has role restriction → check
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // User logged in but wrong role → redirect to their dashboard
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

  return true; // Access granted
};
