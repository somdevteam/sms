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
    firstName:string;


    @IsNotEmpty()
    @IsString()
    middleName:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;
    // @IsString()
    // sex:string;

    @IsNotEmpty()
    @IsString()
    pob:string;

    @IsNotEmpty()
    @IsNumber()
    guardianId:number;


}
