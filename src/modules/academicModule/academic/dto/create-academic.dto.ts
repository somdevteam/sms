import {IsNotEmpty, IsString, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateAcademicDto {
    academicid:number;
    @ApiProperty({
        required: true,
    })
    @IsString()
    @Matches(/^\d{4}-\d{4}$/)
    @IsNotEmpty()
    academicname:string;
}
