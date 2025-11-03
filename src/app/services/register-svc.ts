import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserDto, UserDto } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class RegisterSvc {
   private apiUrl = 'https://localhost:7257/api/User';

  constructor(private http: HttpClient) { }

  createUser(dto: CreateUserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.apiUrl, dto);
  }

  // getBankUsers(): Observable<UserDto[]> {
  //   return this.http.get<UserDto[]>(`${this.apiUrl}/bankusers`);
  // }
}
