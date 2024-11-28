import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class StudentsByClassSectionDto {
   

    @IsNotEmpty()
    @IsNumber()
    branchId:number
    @IsOptional()
    @Type(() => Number)
    classId: number;
    @IsOptional()
    @IsNumber()
    sectionId: number;

    @IsOptional()
    @Type(() => Number)
    rollNumber: number;
}
