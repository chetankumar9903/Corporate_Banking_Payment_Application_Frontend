
export interface SalaryDisbursement {
  salaryDisbursementId: number;
  clientId: number;
  employeeId: number;
  amount: number;
  date: string; 
  description?: string;
  batchId?: number;

  employeeName?: string;
  clientCompanyName?: string;
}