import { IsNotEmpty } from "class-validator";

export class CreateClassSectionDto {
    classSectionId:number;
    @IsNotEmpty()
    branchid:number;
    @IsNotEmpty()
    classid:number;
    @IsNotEmpty()
    sectionid:number;
    @IsNotEmpty()
    academicid:number;
}
