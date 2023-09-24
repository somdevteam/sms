import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {;
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    confirmPassword: string;
}
