import { IsNotEmpty, IsNumber } from "class-validator";

export class StudentsByClassSectionDto {
   
    academicId:number
    branchId:number
    @IsNotEmpty()
    @IsNumber()
    classId: number;
    @IsNotEmpty()
    @IsNumber()
    sectionId: number;
}
