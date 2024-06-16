import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateExamInfoDto } from './dto/create-exam-info.dto';
import { UpdateExamInfoDto } from './dto/update-exam-info.dto';
import { ExamsInfo } from './exam-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';

@Injectable()
export class ExamInfoService {

  constructor(
    @InjectRepository(ExamsInfo)
    private readonly examInfoRepository: Repository<ExamsInfo>,
    private readonly branchAcademicService: BranchAcademicService,
  ) {
  }

  async create(payload: CreateExamInfoDto) {
    const { examId, startDate, endDate, description, branchId } = payload;

    const existingBranchAcademic = await this.branchAcademicService.findActiveBranchAcademic(branchId);

    if (!existingBranchAcademic) {
      throw new NotFoundException(`active branch with id ${branchId} not found`);
    }

    const isRecordExists = await this.examInfoRepository.findOne({
      where: {
        academicBranch: existingBranchAcademic,
        exam: { examId },
      }
    });
    if (isRecordExists) {
      throw new NotAcceptableException(`branch with this exam already exiss`);
    }

    const createExamInfo = this.examInfoRepository.create({
      exam: { examId },
      startDate: startDate,
      endDate: endDate,
      dateCreated: new Date(),
      description: description,
      academicBranch: existingBranchAcademic
    })

    return await this.examInfoRepository.save(createExamInfo);
  }

  findAll() {
    return `This action returns all examInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examInfo`;
  }

  update(id: number, updateExamInfoDto: UpdateExamInfoDto) {
    return `This action updates a #${id} examInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} examInfo`;
  }
}
