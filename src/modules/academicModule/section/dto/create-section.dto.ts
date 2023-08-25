import { IsNotEmpty } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateSectionDto {
    sectionid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    sectionname:string;
}
