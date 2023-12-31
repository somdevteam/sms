import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdateStudentDto {
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

    @IsNotEmpty()
    @IsNumber()
    responsibleId:number;


}
