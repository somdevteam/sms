import {IsArray, IsNotEmpty, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class StudentclassDto {
    @IsNotEmpty()
    studentId: number;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    classSectionId: number;

    @IsNotEmpty()
    dateCreated: string;

    classId: number;
    sectionId: number;
}

export class StudentclassArrayDto {
    @IsNotEmpty()
    academicYearId:number
    @IsNotEmpty()
    fromClass:number
    @IsNotEmpty()
    fromSection:number
    @IsNotEmpty()
    toClass: number;
    @IsNotEmpty()
    toSection: number;
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StudentclassDto)
    students: StudentclassDto[];
}

