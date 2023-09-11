import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentLeaveDto } from './create-student-leave.dto';

export class UpdateStudentLeaveDto extends PartialType(CreateStudentLeaveDto) {}
