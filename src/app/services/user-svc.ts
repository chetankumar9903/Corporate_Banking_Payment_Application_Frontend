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

  /**
   * --- THIS METHOD IS NOW UPDATED ---
   * It calls the new endpoint that only returns unassigned CLIENTUSERs.
   * No client-side filtering is needed.
   */
  getAvailableClientUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/available-client-users`);
  }
  
  // Note: The old 'getUsers' method is no longer needed for this feature.
}