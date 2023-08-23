import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  getBySectionname(subjectname: string): Promise<Subject> {
    return this.subjectRepository.findOne({ where: { subjectname: subjectname } });
  }

  getById(id: number): Promise<Subject> {
    return this.subjectRepository.findOne({ where: { subjectid: id } });
  }

  create(payload: CreateSubjectDto) {
    let subjectname = this.getBySectionname(payload.subjectname);
    if (subjectname) {
      throw new NotAcceptableException(
        'The level name currently exists. Please choose another one.',
      );
    }

    let subject = new Subject();
    subject.subjectname = payload.subjectname;
    subject.datecreated = new Date();
    try {
      const savedClass = this.subjectRepository.save(subject);
      return savedClass;
    } catch (error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  findAll() {
    return `This action returns all level`;
  }

  findOne(id: number) {
    return `This action returns a #${id} level`;
  }

  async update(payload: UpdateSubjectDto) {
    let foundsubject = await this.getById(payload.subjectid);

    if (!foundsubject) {
      throw new NotFoundException('subject not found');
    }

    try {
      foundsubject.subjectname = payload.subjectname;
      return await this.subjectRepository.update(foundsubject.subjectid, foundsubject);
    } catch (error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async remove(id: number) {
    let foundsubject = await this.getById(id);

    if (!foundsubject) {
      throw new NotFoundException('level not found');
    }
    return await this.subjectRepository.delete(id);
  }
}
