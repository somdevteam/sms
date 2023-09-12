import { IsNotEmpty, IsNumber } from "class-validator";

export class StudentsByClassSectionDto {
    @IsNotEmpty()
    @IsNumber()
    classId: number;
    @IsNotEmpty()
    @IsNumber()
    sectionId: number;
}