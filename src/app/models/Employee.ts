export interface EmployeeDto {
  employeeId: number;
  clientId: number;
  employeeCode: string;
  firstName: string;
  lastName?: string;
  emailId: string;
  phoneNumber: string;
  position?: string;
  department?: string;
  salary: number;
  joinDate: string;
  accountNumber: string;
  isActive: boolean;
}

export interface CreateEmployeeDto {
  clientId: number;
  firstName: string;
  lastName?: string;
  emailId: string;
  phoneNumber: string;
  position?: string;
  department?: string;
  salary: number;
  isActive: boolean;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  phoneNumber?: string;
  position?: string;
  department?: string;
  salary?: number;
  isActive?: boolean;
}
