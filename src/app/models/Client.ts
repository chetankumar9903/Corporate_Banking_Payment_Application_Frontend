// Based on your backend ClientDto
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

// Based on your backend CreateClientDto
export interface CreateClientDto {
  customerId: number;
  bankId: number;
  companyName: string;
  initialBalance: number;
}