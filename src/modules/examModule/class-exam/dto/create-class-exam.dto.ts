import { IsArray, IsNotEmpty } from "class-validator";

export class CreateClassExamDto {
    @IsNotEmpty()
    examInfoId: number

    @IsNotEmpty()
    @IsArray()
    classIds: number[];
}
