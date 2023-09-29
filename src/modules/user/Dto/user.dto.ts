import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    userId: number;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    middleName: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    mobile: string;

    @ApiProperty({
        required: true,
    })
    
    // @IsNotEmpty()
    password: string;

    @ApiProperty({
        required: true,
    })
    isActive: boolean;

    @ApiProperty({
        required: true,
    })
    datecreated: Date;


    @ApiProperty({
        required: true,
    })
    branchId: number;
}
