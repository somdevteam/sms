import { IsNotEmpty, IsBoolean, IsDateString, IsNumber } from 'class-validator';

export class UpdateBranchDTO {

    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @IsNotEmpty()
    branchName: string;

    @IsNotEmpty()
    branchLocation: string;

    
    branchLogo: string;


    coverLogo: string;


    datecreated: Date;

    isactive: boolean;

}
