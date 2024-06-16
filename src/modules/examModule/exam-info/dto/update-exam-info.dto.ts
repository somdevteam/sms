import { PartialType } from '@nestjs/mapped-types';
import { CreateExamInfoDto } from './create-exam-info.dto';

export class UpdateExamInfoDto extends PartialType(CreateExamInfoDto) {}
