import { IsNotEmpty } from "class-validator";

export class SectionByClassDto {

    @IsNotEmpty()
    branchid:number;
    @IsNotEmpty()
    classid:number;
    academicid:number;
}