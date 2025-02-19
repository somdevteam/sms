import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { BranchService } from '../../branch/branch.service';
import { ClassService } from '../class/class.service';
import { SubjectService } from '../subject/subject.service';
import { ClassSubject } from './entities/class-subject.entity';
import { Subject } from '../subject/entities/subject.entity';
import { CreateClassSubjectDto } from './dto/create-class-subject.dto';

@Injectable()
export class ClassSubjectService {

  constructor(
    @InjectRepository(ClassSubject) 
    private classSubjectRepository: Repository<ClassSubject>,
    @InjectRepository(Subject) 
    private subjectRepository: Repository<Subject>,
  ) {}

  getById(id: number): Promise<ClassSubject> {
    return this.classSubjectRepository.findOne({ where: { class_subject_id: id } });
  }

  async createClassSubject(createClassSubjectDto: CreateClassSubjectDto): Promise<ClassSubject[]> {
    const { classId, subjectId, branchId } = createClassSubjectDto;
  
    const classSubjects = subjectId.map(subjectId => 
      this.classSubjectRepository.create({
        class: { classid: classId }, 
        branch: { branchId: branchId }, 
        subject: { subject_id: subjectId }
      })
    );
  
    return this.classSubjectRepository.save(classSubjects);
  }

  async findUnassignedSubjects(payload: any): Promise<any> {
    const { classId,branchId } = payload;
    const assignedSubjects = await this.classSubjectRepository.find(
      { 
        relations: ['class', 'branch', 'subject'],
        where: { 
        class: { classid: classId } ,
        branch: { branchId: branchId }
      } 
      }
    );

    const assignedSubjectIds = assignedSubjects.map((cs) => cs.subject.subject_id);


    return await this.subjectRepository.find({
      where: assignedSubjectIds.length > 0 ? { subject_id: Not(In(assignedSubjectIds)) } : {},
    });
  }

  async findSubjectsByClass(classId: number, branchId: number): Promise<any> {
    return await this.classSubjectRepository.find({
      relations: ['class', 'branch', 'subject'],
      where: { class: { classid: classId }, branch: { branchId: branchId } },
    });
  }
}
