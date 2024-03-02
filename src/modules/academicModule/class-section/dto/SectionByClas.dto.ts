import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class SectionByClassDto {

    @IsNotEmpty()
    branchId:number;
    @IsNotEmpty()
    classId:number;
    academicId:number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SectionData)
    sections: SectionData[];
}

export class SectionData {
    @IsNumber()
    sectionid: number;
  
    @IsString()
    sectionname: string;
  }