import { IsNotEmpty, IsBoolean, IsDateString, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";


export class CreateClassDto {
    classid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    classname:string;
}
