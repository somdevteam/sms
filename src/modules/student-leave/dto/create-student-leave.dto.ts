import {IsEmpty, IsNotEmpty} from "class-validator";

export class CreateStudentLeaveDto {
    @IsNotEmpty()
    reason: string;
    dateLeave: string;
    studentclassid: number;
    dateCreated: string;
    studentid: number;
}
