import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  studentClassId: number;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  paymentTypeId: number;
  @ApiProperty({
    required: true,
  })

  @IsNotEmpty()
  paymentStateId: number;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    required: false,
  })
  monthId:1;
  monthName:string

  @ApiProperty({required:true})
  rollNo:string



}
