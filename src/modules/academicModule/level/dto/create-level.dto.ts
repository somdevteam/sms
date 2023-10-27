import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateLevelDto {
    levelid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    levelname:string;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    levelFee:number;
}
