// Based on your backend Status enum
export enum Status {
  // --- UPDATE THESE LINES ---
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
  // --- END OF UPDATE ---
}

// Based on your backend CustomerDto
export interface Customer {
  customerId: number;
  userId: number;
  bankId: number;
  onboardingDate: string; // ISO 8601 date string
  verificationStatus: Status;
  isActive: boolean;
  userName?: string;
  bankName?: string;
}

// Based on your backend CreateCustomerDto
export interface CreateCustomerDto {
  userId: number;
  bankId: number;
}