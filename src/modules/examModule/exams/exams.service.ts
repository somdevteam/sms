import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './exam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';

@Injectable()
export class ExamsService {

  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly branchAcademicService: BranchAcademicService,
  ) {}

  async create(payload: CreateExamDto) {
    const createExam = this.examRepository.create({
      examName: payload.examName
    })

    return await this.examRepository.save(createExam);
  }

  async findExamsByBranch(branchId: number) {
    const currentAcademicBranch = await this.branchAcademicService.findActiveBranchAcademic(branchId);
    if (!currentAcademicBranch) {
      throw new NotFoundException('academic with this branch not found');
    }

    const exams = await this.examRepository.find({
      relations: ['examsInfo','examsInfo.academicBranch.branch'],
      where: {
        examsInfo: {
          academicBranch: currentAcademicBranch
        },
        
        isActive: true
      }
    }) 
    return exams;
  }

  findAll() {
    return this.examRepository.find({
      where: { isActive: true }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
