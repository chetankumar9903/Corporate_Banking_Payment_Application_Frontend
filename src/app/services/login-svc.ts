import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginViewModel } from '../models/LoginViewModel';
import { AuthResponseViewModel } from '../models/auth-response';


@Injectable({
  providedIn: 'root'
})
export class LoginSvc {

  private apiUrl = 'https://localhost:7257/api/Auth'; 

  constructor(private http: HttpClient) {}

  // Login API Call
  loginUser(user: LoginViewModel): Observable<AuthResponseViewModel> {
    return this.http.post<AuthResponseViewModel>(`${this.apiUrl}/login`, user);
  }

  // Save token & role to localStorage
  saveToken(authResponse: AuthResponseViewModel): void {
    localStorage.setItem('token', authResponse.token);

    const payloadBase64 = authResponse.token.split('.')[1];
  const decodedPayload = JSON.parse(atob(payloadBase64)); // decode the token
  console.log('token saved');
  console.log(decodedPayload);
  console.log(decodedPayload["role"]);


  // save the role in localStorage
  // localStorage.setItem('role', decodedPayload["role"]);
  console.log(decodedPayload["email"]);
  console.log(decodedPayload["username"]);
  

    localStorage.setItem('role', authResponse.role);
    localStorage.setItem('username', authResponse.userName);
    localStorage.setItem('email', authResponse.emailId);
    localStorage.setItem('fullname', authResponse.fullName);
  }


// getRole(token: string): string {
//   const payloadBase64 = token.split('.')[1];
//   const decodedPayload = JSON.parse(atob(payloadBase64));
//   console.log(decodedPayload);
//   console.log(decodedPayload["role"]+'in getRole()');
  
//   return decodedPayload["role"];
// }


  // Decode token to extract role (optional if backend already sends role)
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }

   // decode token payload (no validation) to extract user info
  private decodePayload(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    const payload = token ? this.decodePayload(token) : null;
    if (!payload) return null;
    // adjust key used in your token (you used "userid")
    return payload['userid'] ? Number(payload['userid']) : null;
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    const payload = token ? this.decodePayload(token) : null;
    return payload ? payload['role'] : null;
  }
}
