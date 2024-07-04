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
  studentFeeTypeId: number;
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

}
