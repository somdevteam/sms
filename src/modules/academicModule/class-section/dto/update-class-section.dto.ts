import { IsNotEmpty } from 'class-validator';


export class UpdateClassSectionDto {
    @IsNotEmpty()
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
