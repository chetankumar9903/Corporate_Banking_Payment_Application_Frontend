import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';
import { UserDto, UserRole } from '../models/User';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSvc {
  private baseUrl = 'https://localhost:7257/api/User';

  constructor(private http: HttpClient) { }

  getAvailableClientUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/available-client-users`);
  }
  
}