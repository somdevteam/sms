import {IsArray, IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class StudentclassDto {
    @IsNotEmpty()
    studentId: number;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    classSectionId: number;

    @IsNotEmpty()
    dateCreated: string;

    classId: number;
    sectionId: number;
}

export class StudentclassArrayDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StudentclassDto)
    students: StudentclassDto[];
}








// import { Controller } from '@nestjs/common';
// import {ApiProperty} from "@nestjs/swagger";
// import {IsNotEmpty} from "class-validator";
//
// @Controller('dto')
// export class StudentclassDto {
//     @IsNotEmpty()
//     studentId:number;
//
//     @ApiProperty({
//         required: true,
//     })
//     @IsNotEmpty()
//     classSectionId:number;
//
//     @IsNotEmpty()
//     dateCreated: string;
//
//     classId : number;
//     sectionId : number;
// }