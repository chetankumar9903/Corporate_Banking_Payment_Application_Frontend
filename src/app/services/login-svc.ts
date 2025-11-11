
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

  loginUser(user: LoginViewModel): Observable<AuthResponseViewModel> {
    return this.http.post<AuthResponseViewModel>(`${this.apiUrl}/login`, user);
  }

  saveToken(authResponse: AuthResponseViewModel): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('role', authResponse.role);
    localStorage.setItem('username', authResponse.userName);
    localStorage.setItem('email', authResponse.emailId);
    localStorage.setItem('fullname', authResponse.fullName);

    try {
      const payloadBase64 = authResponse.token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      const userId = decodedPayload.userid;
      if (userId) {
        localStorage.setItem('userId', userId);
        console.log('userId:', userId);
      } else {
        console.warn("⚠️ No 'userid' claim found in token");
      }

      console.log('Decoded token:', decodedPayload);

    } catch (e) {
      console.error('Failed to decode JWT token:', e);
    }

    if (authResponse.clientId !== undefined && authResponse.clientId !== null) {
      localStorage.setItem('clientId', authResponse.clientId.toString());
    } else {
      localStorage.removeItem('clientId');
    }
  }


  saveBankId(bankId: number): void {
    localStorage.setItem('bankId', bankId.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getBankId(): number | null {
    const bankId = localStorage.getItem('bankId');
    return bankId ? +bankId : null;
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  getClientId(): number | null {
    const v = localStorage.getItem('clientId');
    return v ? Number(v) : null;
  }


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
    return payload && payload['userid'] ? Number(payload['userid']) : null;
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    const payload = token ? this.decodePayload(token) : null;
    return payload ? payload['role'] : null;
  }

  logout(): void {
    localStorage.clear();
  }
}
