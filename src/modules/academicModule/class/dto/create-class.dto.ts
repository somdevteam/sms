import { IsNotEmpty, IsBoolean, IsDateString, IsString } from 'class-validator';


export class CreateClassDto {
    classid:number;
    @IsNotEmpty()
    @IsString()
    classname:string;
}
