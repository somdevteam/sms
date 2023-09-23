import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserFilterDto {
    isActive: string;
    branchId: number;
    name: string;
}
