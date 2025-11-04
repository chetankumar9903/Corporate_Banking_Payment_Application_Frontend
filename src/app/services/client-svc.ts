import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientSvc {
  private apiUrl = 'https://localhost:7257/api'; // Adjust your base URL

  constructor(private http: HttpClient) {}

  getBalance(clientId: number): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.apiUrl}/Client/${clientId}/balance`);
  }
  updateBalance(clientId: number, dto: { amount: number }) {
  return this.http.patch(`${this.apiUrl}/Client/${clientId}/balance`,dto);
}

getClientProfile(clientId: number) {
  return this.http.get<ClientProfile>(`${this.apiUrl}/Client/${clientId}`);
}
}
