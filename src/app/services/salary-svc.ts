import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BatchTransactionDto, CreateBatchTransactionDto, CreateSalaryDisbursementDto, SalaryDisbursementDto } from '../models/salary';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalarySvc {
  private base = 'https://localhost:7257/api/SalaryDisbursement';
  private batchBase = 'https://localhost:7257/api/BatchTransaction';

  constructor(private http: HttpClient) {}


  getAll(
  clientId?: number,
  searchTerm?: string,
  sortColumn?: string,
  sortOrder?: 'asc'|'desc',
  pageNumber = 1,
  pageSize = 10
) {
  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString());
  if (clientId) params = params.set('clientId', clientId.toString());
  if (searchTerm) params = params.set('searchTerm', searchTerm);
  if (sortColumn) params = params.set('sortColumn', sortColumn);
  if (sortOrder) params = params.set('sortOrder', sortOrder.toUpperCase());
  return this.http.get<{ items: SalaryDisbursementDto[]; totalCount: number }>(this.base, { params });
}


  getByClientId(clientId: number) {
    return this.http.get<SalaryDisbursementDto[]>(`${this.base}/client/${clientId}`);
  }

  create(dto: CreateSalaryDisbursementDto) {
    return this.http.post<SalaryDisbursementDto>(this.base, dto);
  }

  update(id: number, dto: Partial<CreateSalaryDisbursementDto>) {
    return this.http.put<SalaryDisbursementDto>(`${this.base}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  // Batch
  getAllBatches() {
    return this.http.get<BatchTransactionDto[]>(this.batchBase);
  }

  getByClientBatches(clientId: number) {
    return this.http.get<BatchTransactionDto[]>(`${this.batchBase}/client/${clientId}`);
  }

  // createBatch(dto: CreateBatchTransactionDto) {
  //   return this.http.post<BatchTransactionDto>(this.batchBase, dto);
  // }


   createBatch(dto: any): Observable<any> {
    return this.http.post<BatchTransactionDto>(this.batchBase, dto);
  }
  deleteBatch(id: number) {
    return this.http.delete(`${this.batchBase}/${id}`);
  }

   uploadCsv(formData: FormData, clientId: number): Observable<any> {
    return this.http.post(`${this.batchBase}/upload-csv?clientId=${clientId}`, formData);
  }
}
