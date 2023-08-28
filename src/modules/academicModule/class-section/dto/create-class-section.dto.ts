import { IsNotEmpty } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateClassSectionDto {
    classSectionId:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    branchid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    classid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    sectionid:number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    academicid:number;
}
