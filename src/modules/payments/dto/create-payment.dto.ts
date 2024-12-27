import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({ required: false })
  //@IsNotEmpty()
  studentClassId: number;

  @ApiProperty({ required: false })
 // @IsNotEmpty()
  sName: string; // Added sName field

  @ApiProperty({ required: true })
  @IsNotEmpty()
  paymentTypeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  paymentStateId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  rollNo: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string; // Updated to match 'details' in payload

  @ApiProperty({ required: false })
  @IsOptional()
  monthName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  monthId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  className: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sectionName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  levelName: string;

  @ApiProperty({ required: false })
 // @IsNotEmpty()
  studentId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  responsibleId: number; // Added responsibleId field
}
