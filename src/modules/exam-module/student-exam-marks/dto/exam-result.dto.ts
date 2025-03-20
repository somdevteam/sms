import { IsNumber, IsOptional } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class ExamResultDto{
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @IsNotEmpty()
    @IsNumber()
    examId: number;
    
    @IsNotEmpty()
    @IsNumber()
    classId: number;

    @IsOptional()
    @IsNumber()
    sectionId: number;
}
