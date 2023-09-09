import { Controller } from '@nestjs/common';
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

@Controller('dto')
export class StudentclassDto {
    @IsNotEmpty()
    studentId:number;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    classSectionId:number;

    @IsNotEmpty()
    dateCreated: string;

    classId : number;
    sectionId : number;
}
