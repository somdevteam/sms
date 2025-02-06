import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './exam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchAcademicService } from 'src/modules/branch-academic/branch-academic.service';
import { ExamsInfo } from './exam-info.entity';
import { ClassExam } from './class-exam.entity';
import { Class } from 'src/modules/academicModule/class/entities/class.entity';

@Injectable()
export class ExamsService {

  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(ExamsInfo)
    private readonly examInfoRepository: Repository<ExamsInfo>,
    private readonly branchAcademicService: BranchAcademicService,
    @InjectRepository(ClassExam)
    private readonly classExamRepository: Repository<ClassExam>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) { }

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
      relations: ['examsInfo', 'examsInfo.academicBranch.branch'],
      where: {
        examsInfo: {
          academicBranch: {academicBranchId: currentAcademicBranch.academicBranchId}
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

  // exam info

  async createExamInfo(payload: any) {
    const { examId, startDate, endDate, description, branchId } = payload;

    const existingBranchAcademic = await this.branchAcademicService.findActiveBranchAcademic(branchId);

    if (!existingBranchAcademic) {
      throw new NotFoundException(`active branch with id ${branchId} not found`);
    }

    const isRecordExists = await this.examInfoRepository.findOne({
      where: {
        academicBranch: {academicBranchId: existingBranchAcademic.academicBranchId},
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

  async updateExamInfo(id: number, payload: any) {
    const { branchId, examId, startDate, endDate, description } = payload;

    const currentBranchAcademic = await this.branchAcademicService.findActiveBranchAcademic(branchId);

    if (!currentBranchAcademic) {
      throw new NotFoundException(`active branch with id ${branchId} not found`);
    }

    const examInfo = await this.examInfoRepository.findOneBy({ examInfoId: id });
    if (!examInfo) {
      throw new NotFoundException(`exam info with thid id ${id} not found`)
    }

    const exam = await this.examRepository.findOneOrFail({ where: { examId: examId } })
      .catch(() => {
        throw new NotFoundException(`Exam with ID ${examId} not found`);
      });

    // examInfo.exam = {examId: exam.examId};
    examInfo.academicBranch = currentBranchAcademic;
    examInfo.startDate = startDate;
    examInfo.endDate = endDate;
    examInfo.description = description;

    return await this.examInfoRepository.update(examInfo.examInfoId, examInfo);
  }

  async addClassExam(payload: any) {
      const { examInfoId, classIds } = payload;
      const classExams: ClassExam[] = [];
      const exam = await this.examInfoRepository.findOne({ where: { examInfoId: examInfoId } });
      if (!exam) {
        throw new NotFoundException('ExamInfo not found');
      }
  
      try {
        for (const classId of classIds) {
          const classEntity = await this.classRepository.findOne({ where: { classid: classId } });
          if (!classEntity) {
            throw new NotFoundException(`Class with ID ${classId} not found`);
          }
          const classExam = new ClassExam();
          classExam.exam = exam;
          classExam.class = classEntity;
          classExams.push(classExam);
        }
        return await this.classExamRepository.save(classExams);
      } catch (error) {
        throw new InternalServerErrorException(`Error creating ClassExam: ${error.message}`);
      }
    }
}
