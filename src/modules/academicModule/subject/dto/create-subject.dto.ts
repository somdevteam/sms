import { IsNotEmpty } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateSubjectDto {
    subjectid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    subjectname:string;
}
