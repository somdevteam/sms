import { IsNotEmpty, IsNumber } from 'class-validator';

export class BranchLevel {
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @IsNotEmpty()
  @IsNumber()
  levelId: number;
}
