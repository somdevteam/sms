import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateStudentDto {
    studentid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    firstname:string;


    @IsNotEmpty()
    @IsString()
    middlename:string;

    @IsNotEmpty()
    @IsString()
    lastname:string;
    @IsString()
    sex:string;

    @IsNotEmpty()
    @IsString()
    bob:string;





}
