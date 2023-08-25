import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLevelDto {
    @IsNotEmpty()
    levelid:number;
    @IsNotEmpty()
    @IsString()
    levelname:string;
}
