import { IsNotEmpty, IsNumber, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { DueCategory } from '../entities/payment-charge-request.entity';
import { ChargeStatus } from '../enums/charge-status.enum';

export class CreatePaymentChargeRequestDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  studentClassId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsEnum(DueCategory)
  dueCategory: DueCategory;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePaymentChargeRequestDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(DueCategory)
  dueCategory?: DueCategory;

  @IsOptional()
  @IsEnum(ChargeStatus)
  status?: ChargeStatus;

  @IsOptional()
  @IsString()
  description?: string;
}

export class PaymentChargeRequestFilterDto {
  @IsOptional()
  @IsNumber()
  classId?: number;

  @IsOptional()
  @IsNumber()
  sectionId?: number;

  @IsOptional()
  @IsEnum(ChargeStatus)
  status?: ChargeStatus;

  @IsOptional()
  @IsEnum(DueCategory)
  dueCategory?: DueCategory;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class GenerateChargesDto {
  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsNumber()
  sectionId: number;

  @IsNotEmpty()
  @IsEnum(DueCategory)
  dueCategory: DueCategory;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
} 