import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTestDto } from 'src/test/dto/create-test.dto';

export class UpdateClassDto  {
    @IsNotEmpty()
    classid:number;
    @IsNotEmpty()
    @IsString()
    classname:string;
    
}
