import { IsNumber, IsArray, IsString, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LevelClassDto {
  @IsNumber()
  branchid: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassData)
  classid: ClassData[];

  @IsNumber()
  levelid: number;
}

export class ClassData {
  @IsNumber()
  classid: number;

  @IsString()
  classname: string;
}
