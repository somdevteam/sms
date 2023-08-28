import { IsNotEmpty } from "class-validator";

export class CreateClassSubjectDto {
    classSubjectId:number;
    @IsNotEmpty()
    branchid:number;
    @IsNotEmpty()
    classid:number;
    @IsNotEmpty()
    subjectid:number;
}
