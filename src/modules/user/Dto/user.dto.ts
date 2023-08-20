import {IsEmail, IsNotEmpty} from "class-validator";

export class UserDto {
    userId: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    isActive: boolean;

    datecreated: Date;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    middleName: string;

    @IsNotEmpty()
    mobile: number;

    branchId: number;
}