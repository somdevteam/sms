import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetRollNumberDto{
  @IsNotEmpty()
  @IsNumber()
  rollNumber :number;
}
