import { IsNotEmpty } from "class-validator";

export class UpdateSubjectDto {
    @IsNotEmpty()
    subjectid:number;
    @IsNotEmpty()
    subjectname:string;
}
