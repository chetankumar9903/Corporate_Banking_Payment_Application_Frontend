// Based on your SalaryDisbursementDto
export interface SalaryDisbursement {
  salaryDisbursementId: number;
  clientId: number;
  employeeId: number;
  amount: number;
  date: string; // ISO 8601 date string
  description?: string;
  batchId?: number;

  // From the backend DTO
  employeeName?: string;
  clientCompanyName?: string;
}