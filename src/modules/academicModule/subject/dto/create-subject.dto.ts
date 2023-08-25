import { IsNotEmpty } from "class-validator";

export class CreateSubjectDto {
    subjectid:number;
    @IsNotEmpty()
    subjectname:string;
}
