import { IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class BranchDTO {

    branchId: number;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    branchName: string;
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    branchLocation: string;

    @ApiProperty({
        required: false,
    })
    branchLogo: string;

    @ApiProperty({
        required: false,
    })
    coverLogo: string;

    @ApiProperty({
        required: false,
    })
    datecreated: Date;

    @ApiProperty({
        required: false,
    })
    isactive: boolean;
}
