import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

export class StudentAttendanceDto {
  @IsInt()
  studentId: number;

  @IsInt()
  studentClassId: number;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  remar?: string;
}

export class CreateAttendanceDto {
  @IsInt()
  branchId: number;

  @IsInt()
  classId: number;

  @IsInt()
  sectionId: number;

  @IsDateString()
  attendanceDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  attendance: StudentAttendanceDto[];
}
