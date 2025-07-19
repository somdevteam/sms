import { IsNotEmpty, IsNumber } from 'class-validator';

export class GeneratePaymentChargesDto {
    @IsNotEmpty()
    @IsNumber()
    branchId: number;

    @IsNotEmpty()
    @IsNumber()
    academicId: number;
} 