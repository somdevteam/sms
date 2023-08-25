import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchService } from '../../branch/branch.service';
import { ClassService } from '../class/class.service';
import { SubjectService } from '../subject/subject.service';
import { CreateClassSubjectDto } from './dto/create-class-subject.dto';
import { UpdateClassSubjectDto } from './dto/update-class-subject.dto';
import { ClassSubject } from './entities/class-subject.entity';

@Injectable()
export class ClassSubjectService {

  constructor(
    @InjectRepository(ClassSubject) private classSubjectRepository: Repository<ClassSubject>,
    private readonly branchService :BranchService,
    private readonly classService :ClassService,
    private readonly subjectService :SubjectService,
  ) {}

  getById(id: number): Promise<ClassSubject> {
    return this.classSubjectRepository.findOne({ where: { classSubjectId: id } });
  }

 async create(payload: CreateClassSubjectDto) {
    const branch = await this.branchService.getById(payload.branchid);
   if (!branch) {
    throw new NotFoundException(`branch with ID ${payload.branchid} not found`)
   }


   const clas = await this.classService.getById(payload.classid);
   if (!clas) {
    throw new NotFoundException(`class with ID ${payload.classid} not found`)
   }

   const subject = await this.subjectService.getById(payload.subjectid);
   if (!subject) {
    throw new NotFoundException(`subject with ID ${payload.subjectid} not found`)
   }

   try {

    let classSub = new ClassSubject();
    classSub.branch = branch;
    classSub.class = clas;
    classSub.subject = subject;

    return await this.classSubjectRepository.save(classSub);

   }catch(error) {
    if (error) {
      throw new ConflictException(
        'The provided branch name is already associated.' + error.messages,
      );
    }
    throw new InternalServerErrorException(
      'An error occurred while creating the branch.',
    );
  }

  }

  findAll() {
    return `This action returns all classSubject`;
  }

  
  findOne(id: number) {
    return `This action returns a #${id} classSubject`;
  }

  async update(payload: UpdateClassSubjectDto) {
    const branch = await this.branchService.getById(payload.branchid);
   if (!branch) {
    throw new NotFoundException(`branch with ID ${payload.branchid} not found`)
   }


   const clas = await this.classService.getById(payload.classid);
   if (!clas) {
    throw new NotFoundException(`class with ID ${payload.classid} not found`)
   }

   const subject = await this.subjectService.getById(payload.subjectid);
   if (!subject) {
    throw new NotFoundException(`subject with ID ${payload.subjectid} not found`)
   }

   const foundClassSubject = await this.getById(payload.classSubjectId);
   foundClassSubject.branch = branch;
   foundClassSubject.class = clas;
   foundClassSubject.subject = subject;

   return await this.classSubjectRepository.update(foundClassSubject.classSubjectId,foundClassSubject);



  }

  async remove(id: number) {
    const foundClassSubject = await this.getById(id);

    if (!foundClassSubject) {
      throw new NotFoundException('Branch Not found');
    }
    return this.classSubjectRepository.delete(id);
  }
}
