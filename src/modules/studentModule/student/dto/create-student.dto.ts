import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import { Responsible } from "../../responsible/entities/responsible.entity";
import { StudentClass } from "../../studentclass/entities/studentclass.entity";

export class CreateStudentDto {
    studentId:number;
    @ApiProperty({
        required: true,
    })

    @IsNotEmpty()
    @IsNumber()
    rollNumber: number;

    @IsNotEmpty()
    @IsString()
    firstName:string;

    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsString()
    middleName:string;

    @IsNotEmpty()
    @IsString()
    lastName:string;
    @IsString()
    gender:string;

    @IsNotEmpty()
    @IsString()
    pob:string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    responsibleName: string;

    @IsNotEmpty()
    responsiblePhone:string;

    @IsNotEmpty()
    @IsNumber()
    classId: number;
    @IsNotEmpty()
    @IsNumber()
    sectionId: number;
    branchId:number





}


export interface StudentWithFullName {
    studentid: number;
    rollNumber: number;
    firstname: string;
    middlename: string;
    lastname: string;
    Sex: string;
    dob: Date;
    bob: string;
    responsible: Responsible;
    studentClass: StudentClass[];
    fullName: string;
}
