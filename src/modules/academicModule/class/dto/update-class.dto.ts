import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClassDto  {
    @IsNotEmpty()
    classid:number;
    @IsNotEmpty()
    @IsString()
    classname:string;
    
}
