import {IsEmpty, IsNotEmpty} from "class-validator";

export class CreateStudentLeaveDto {
    @IsNotEmpty()
    reason: string;
    @IsNotEmpty()
    studentclassid: number;
    dateCreated: string;
    @IsNotEmpty()
    studentid: number;
}
