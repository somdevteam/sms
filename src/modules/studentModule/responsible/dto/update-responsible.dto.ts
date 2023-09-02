import { PartialType } from '@nestjs/mapped-types';
import { CreateResponsibleDto } from './create-responsible.dto';
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateResponsibleDto  {

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    responsiblename: string;

    @IsNotEmpty()
    phone:string;



}
