    import { Role } from "./Role";

    export interface UserDto {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    emailId: string;
    phoneNumber: string;
    address: string;
    isActive: boolean;
    userRole: Role;
    }

    export interface CreateUserDto {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    emailId: string;
    phoneNumber: string;
    address: string;
    userRole: Role;
    }

    export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    emailId?: string;
    phoneNumber?: string;
    address?: string;
    isActive?: boolean;
    userRole?: Role;
    }