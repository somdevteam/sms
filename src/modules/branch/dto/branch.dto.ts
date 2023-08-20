import { IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';

export class BranchDTO {

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
