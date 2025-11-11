export interface SalaryDisbursementDto {
  salaryDisbursementId: number;
  clientId: number;
  employeeId: number;
  amount: number;
  date: string; // ISO
  description?: string | null;
  batchId?: number | null;
  employeeName?: string | null;
  clientCompanyName?: string | null;
}

export interface CreateSalaryDisbursementDto {
  clientId: number;
  employeeId: number;
  amount: number;
  description?: string;
  batchId?: number | null;
}

export interface BatchTransactionDto {
  batchId: number;
  clientId: number;
  date: string;
  totalTransactions: number;
  totalAmount: number;
  salaryDisbursements?: SalaryDisbursementDto[];
}

export interface CreateBatchTransactionDto {
  clientId: number;
  employeeIds: number[];
  totalAmount: number;
  description?: string;
}
