import { IsNotEmpty } from "class-validator";

export class UpdateSectionDto {
    @IsNotEmpty()
    sectionid:number;
    @IsNotEmpty()
    sectionname:string;
}
