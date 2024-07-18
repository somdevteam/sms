import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateExamInfoDto {

    @IsNotEmpty()
    @Type(() => Number)
    branchId: number;

    @IsNotEmpty()
    @IsNumber()
    examId: number;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;

    @IsNotEmpty()
    description: string;
}
