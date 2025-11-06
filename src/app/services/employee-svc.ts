import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginSvc } from './login-svc';
import { Observable } from 'rxjs';
import { CreateEmployeeDto, EmployeeDto, UpdateEmployeeDto } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSvc {
   private apiUrl = 'https://localhost:7257/api/Employee';

  constructor(private http: HttpClient, private loginService: LoginSvc) {}

  // Get employees of logged-in client
  getEmployeesByClient(): Observable<EmployeeDto[]> {
    const clientId = this.loginService.getClientId();
    return this.http.get<EmployeeDto[]>(`${this.apiUrl}/byclient/${clientId}`);
  }

  // Create a new employee
  createEmployee(dto: CreateEmployeeDto): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(this.apiUrl, dto);
  }

  // Update employee
  updateEmployee(id: number, dto: UpdateEmployeeDto): Observable<EmployeeDto> {
    return this.http.put<EmployeeDto>(`${this.apiUrl}/${id}`, dto);
  }

  // Delete employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getEmployeeById(id: number): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.apiUrl}/${id}`);
  }

   getByClientId(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byclient/${clientId}`);
  }

  getById(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${employeeId}`);
  }


  uploadCsv(formData: FormData, clientId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/upload-csv?clientId=${clientId}`, formData);
}

 getClientId(): number | null {
    const v = localStorage.getItem('clientId');
    return v ? Number(v) : null;
  }
  
}
