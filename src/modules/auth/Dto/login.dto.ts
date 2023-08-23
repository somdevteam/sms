import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty({message:'Username should no be empty'})
    username : string;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty({message:'Password should no be empty'})
    password : string;

}