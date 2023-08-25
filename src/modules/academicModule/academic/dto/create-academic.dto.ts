import {IsString, Matches } from "class-validator";

export class CreateAcademicDto {
    academicid:number;
    @IsString()
    @Matches(/^\d{4}-\d{4}$/)
    academicname:string;
}
