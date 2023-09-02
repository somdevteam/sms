import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateResponsibleDto {

    responsibleid:number;
     @ApiProperty({
    required: true,
        })
    @IsNotEmpty()
     @IsString()
     responsiblename: string;

     @IsNotEmpty()
    phone:string;


}
