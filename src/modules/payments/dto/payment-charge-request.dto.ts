import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
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
  @IsNumber()
  chargeTypeId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  createdBy: number;

  @IsNotEmpty()
  @IsNumber()
  loginHistoryId: number;
}

export class UpdatePaymentChargeRequestDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  chargeTypeId?: number;

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
  @IsNumber()
  chargeTypeId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
  @IsOptional()
  page: number;
  @IsOptional()
  limit: number;
}

export class GenerateChargesDto {
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @IsNotEmpty()
  chargeTypeCode: string;

  @IsOptional()
  @IsNumber()
  monthId?: number;

  @IsOptional()
  @IsNumber()
  createdBy: number;

  @IsOptional()
  @IsNumber()
  loginHistoryId: number;
}
