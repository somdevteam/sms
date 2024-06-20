import { Injectable } from '@nestjs/common';
import { CreateClassExamDto } from './dto/create-class-exam.dto';
import { UpdateClassExamDto } from './dto/update-class-exam.dto';

@Injectable()
export class ClassExamService {
  create(createClassExamDto: CreateClassExamDto) {
    return 'This action adds a new classExam';
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
