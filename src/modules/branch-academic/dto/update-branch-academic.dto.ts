import { PartialType } from '@nestjs/mapped-types';
import { BranchAcademicDto } from './create-branch-academic.dto';


export class UpdateBranchAcademicDto extends PartialType(BranchAcademicDto) {}
