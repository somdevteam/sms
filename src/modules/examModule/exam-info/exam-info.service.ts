import { Injectable } from '@nestjs/common';
import { CreateExamInfoDto } from './dto/create-exam-info.dto';
import { UpdateExamInfoDto } from './dto/update-exam-info.dto';
import { ExamsInfo } from './exam-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExamInfoService {

  constructor(
    @InjectRepository(ExamsInfo)
    private readonly examInfoRepository: Repository<ExamsInfo>,
  ) {
  }

  async create(payload: CreateExamInfoDto) {
    const { examId, startDate, endDate } = payload;

    const createExamInfo = this.examInfoRepository.create({
      exam: { examId },
      startDate: startDate,
      endDate: endDate
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
