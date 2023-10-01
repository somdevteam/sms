// src/branch/dto/branch-academic.dto.ts

import { IsInt, IsNotEmpty } from 'class-validator';

export class BranchAcademicDto {
  @IsInt()
  @IsNotEmpty()
   branchId: number;

  @IsInt()
  @IsNotEmpty()
   academicId: number;
}
