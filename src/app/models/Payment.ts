import { Status } from "./Status";


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
}

export interface CreatePaymentDto {
  clientId: number;
  beneficiaryId: number;
  amount: number;
  description?: string;
}

export interface UpdatePaymentDto {
  paymentStatus?: Status;
  rejectReason?: string;
}
