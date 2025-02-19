import { IsInt, IsArray, ArrayNotEmpty, IsPositive, IsNumber } from 'class-validator';

export class CreateClassSubjectDto  {
  @IsNumber()
  classId: number;

  @IsNumber()
  branchId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  subjectId: number[];
}
