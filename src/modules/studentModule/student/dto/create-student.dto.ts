import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

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

    @IsNotEmpty()
    @IsNumber()
    studentTypeId: number;

    @ApiProperty({
        required: true,
    })

    @IsNotEmpty()
    @IsString()
    responsibleType: string;

    @IsOptional()
    @IsNumber()
    responsibleId: number;

    @IsOptional()
    @IsString()
    responsibleName: string;

    @IsOptional()
    @IsString()
    responsiblePhone:string;

    @IsNotEmpty()
    @IsNumber()
    classId: number;

    @IsNotEmpty()
    @IsNumber()
    sectionId: number;

    @IsNotEmpty()
    @IsNumber()
    branchId:number

    @IsOptional()
    @IsString()
    guardianType: string;





}
