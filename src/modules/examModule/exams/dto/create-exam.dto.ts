import { IsNotEmpty, IsString } from "class-validator";

export class CreateExamDto {
    @IsNotEmpty()
    @IsString()
    examName: string;
}
