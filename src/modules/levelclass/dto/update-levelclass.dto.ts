import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLevelclassDto {
    @IsNotEmpty()
    levelclassid:number;
    @IsNotEmpty()
    @IsNumber()
    branchid:number;
    @IsNotEmpty()
    @IsNumber()
    levelid:number;
    @IsNotEmpty()
    @IsNumber()
    classid:number;
}
