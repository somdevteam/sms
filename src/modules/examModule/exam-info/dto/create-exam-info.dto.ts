import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateExamInfoDto {

    @IsNotEmpty()
    @IsNumber()
    examId: number;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
}
