
export interface Client {
  clientId: number;
  customerId: number;
  bankId: number;
  companyName: string;
  accountNumber: string;
  balance: number;
  isActive: boolean;
  customerName?: string;
  bankName?: string;
}

export interface CreateClientDto {
  customerId: number;
  bankId: number;
  companyName: string;
  initialBalance: number;
}