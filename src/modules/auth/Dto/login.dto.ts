import {IsEmail, IsNotEmpty} from "class-validator";

export class LoginDto {
    @IsNotEmpty({message:'Username should no be empty'})
    username : string;
    @IsNotEmpty({message:'Password should no be empty'})
    password : string;

}