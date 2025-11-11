
export enum Status {

  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'

}

export interface Customer {
  customerId: number;
  userId: number;
  bankId: number;
  onboardingDate: string;
  verificationStatus: Status;
  isActive: boolean;
  userName?: string;
  bankName?: string;
}

export interface CreateCustomerDto {
  userId: number;
  bankId: number;
}