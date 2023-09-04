import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

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

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    responsiblename: string;

    @IsNotEmpty()
    resPhone:string;

    // @IsNotEmpty()
    // @IsNumber()
    // responsibleId:number;
    classId: number;
    sectionId: number;





}
