import { IsNotEmpty } from "class-validator";

export class UpdateClassSubjectDto {
    @IsNotEmpty()
    classSubjectId:number;
    @IsNotEmpty()
    branchid:number;
    @IsNotEmpty()
    classid:number;
    @IsNotEmpty()
    subjectid:number;
}
