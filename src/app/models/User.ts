export enum UserRole {
  SUPERADMIN = 'SuperAdmin',
  BANKUSER = 'BankUser',
  CLIENTUSER = 'ClientUser'
}

// Based on your backend UserDto
export interface UserDto {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  userRole: UserRole;
}