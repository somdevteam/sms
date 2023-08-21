import { IsNotEmpty, IsString } from "class-validator";

export class CreateLevelDto {
    levelid:number;
    @IsNotEmpty()
    @IsString()
    levelname:string;
}
