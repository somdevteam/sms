import {IsBoolean, IsNotEmpty, IsString, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import { Optional } from "@nestjs/common";

export class CreateAcademicDto {
    academicId:number;
    @ApiProperty({
        required: true,
    })
    @IsString()
    @Matches(/^\d{4}-\d{4}$/,{message: 'The Academic Year range must be in the format YYYY-YYYY.'})
    @IsNotEmpty()
    academicYear:string;

    @Optional()
    @IsBoolean()
    isActive:boolean
}
