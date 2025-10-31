import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginSvc } from '../services/login-svc';

export const authloginInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(LoginSvc);

  const token = authToken.getToken();
  console.log('Token found');

  if(token){
    const cloned = req.clone({ setHeaders:{
      Authorization: `Bearer ${token}`
    }});
    return next(cloned);
  }
  console.log('No token found, skipping auth header');
  return next(req);
};
