import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClassExamDto } from './dto/create-class-exam.dto';
import { UpdateClassExamDto } from './dto/update-class-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassExam } from './entities/class-exam.entity';
import { Repository } from 'typeorm';
import { ExamsInfo } from '../exams/exam-info.entity';
import { Class } from 'src/modules/academicModule/class/entities/class.entity';

@Injectable()
export class ClassExamService {
  constructor(
    @InjectRepository(ClassExam)
    private readonly classExamRepository: Repository<ClassExam>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(ExamsInfo)
    private readonly examsInfoRepository: Repository<ExamsInfo>,
  ) { }

  async create(payload: CreateClassExamDto) {
    const { examInfoId, classIds } = payload;
    const classExams: ClassExam[] = [];
    const exam = await this.examsInfoRepository.findOne({ where: { examInfoId: examInfoId } });
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


  findAll() {
    return `This action returns all classExam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classExam`;
  }

  update(id: number, updateClassExamDto: UpdateClassExamDto) {
    return `This action updates a #${id} classExam`;
  }

  remove(id: number) {
    return `This action removes a #${id} classExam`;
  }
}
