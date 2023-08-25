import { IsNotEmpty } from "class-validator";

export class CreateSectionDto {
    sectionid:number;
    @IsNotEmpty()
    sectionname:string;
}
