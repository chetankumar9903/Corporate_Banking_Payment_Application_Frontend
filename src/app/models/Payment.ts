import { Status } from './Customer';

export interface NestedClient {
  companyName: string;
}
export interface NestedBeneficiary {
  beneficiaryName: string;
  accountNumber: string;
}

export interface Payment {
  paymentId: number;
  clientId: number;
  beneficiaryId: number;
  amount: number;
  requestDate: string;
  processedDate?: string;
  paymentStatus: Status;
  description?: string;
  rejectReason?: string;

  // --- THIS IS THE FIX ---
  client?: NestedClient;
  beneficiary?: NestedBeneficiary;
  // --- END OF FIX ---
}

export interface UpdatePaymentDto {
  paymentStatus: Status;
  rejectReason?: string;
}