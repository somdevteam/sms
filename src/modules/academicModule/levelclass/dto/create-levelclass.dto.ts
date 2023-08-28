import { IsNotEmpty, IsNumber } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateLevelclassDto {
    levelclassid:number;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    branchid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        required: true,
    })
    levelid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    classid:number;
}
