import { PartialType } from '@nestjs/mapped-types';
import { CreateClassExamDto } from './create-class-exam.dto';

export class UpdateClassExamDto extends PartialType(CreateClassExamDto) {}
