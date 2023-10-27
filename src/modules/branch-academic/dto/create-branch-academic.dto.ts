// src/branch/dto/branch-academic.dto.ts

import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';


export class AcademicBranchDto {
  @IsNumber()
  academicId: number;

  @IsArray()
  @ArrayMinSize(1)
  branches: BranchDto[];
}

export class BranchDto {
  @IsNumber()
  branchId: number;

  @IsString()
  branchName: string;
}
