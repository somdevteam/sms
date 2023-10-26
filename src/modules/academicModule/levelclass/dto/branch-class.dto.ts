import { IsNumber } from 'class-validator';

export class BranchLevel {
  @IsNumber()
  branchId: number;

  @IsNumber()
  levelId: number;
}
