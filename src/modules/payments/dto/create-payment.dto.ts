import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  studentClassId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  paymentTypeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  paymentStateId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  rollNo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  monthId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  monthName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  department: string;

  @ApiProperty({ required: false })
  @IsOptional()
  date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  invoiceNo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  duration: string;

  @ApiProperty({ required: false })
  @IsOptional()
  details: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sectionId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  className: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sectionName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  levelName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  responsibleName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  responsibleTell: string;

  @ApiProperty({ required: false })
  @IsOptional()
  responsibleAddress: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  responsiblePhone: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  studentId: number;
}
