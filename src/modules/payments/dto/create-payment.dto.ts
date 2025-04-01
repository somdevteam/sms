import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsOptional()
  @IsNumber()
  studentClassId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  paymentTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  paymentStateId: number;

  @IsNotEmpty()
  @IsNumber()
  monthId: number;

  @IsNotEmpty()
  @IsString()
  rollNo: string;

  @IsOptional()
  @IsNumber()
  responsibleId: number;

  @IsOptional()
  @IsString()
  details?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  monthName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  className: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sectionName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  levelName: string;
}

export class CreateMultiplePaymentsDto {
  @ApiProperty({ type: [CreatePaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentDto)
  payments: CreatePaymentDto[];
}

export class GenerateReceiptDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  paymentIds: number;
}
