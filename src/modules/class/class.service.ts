import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  getByClassname(classname: string): Promise<Class> {
    return this.classRepository.findOne({ where: { classname } });
  }

  getById(id: number): Promise<Class> {
    return this.classRepository.findOne({where: {classid: id}})
}

  create(payload: CreateClassDto) {
    let classname = this.getByClassname(payload.classname);
    if (classname) {
      throw new NotAcceptableException(
        'The class name currently exists. Please choose another one.',
      );
    }

    let clas = new Class();
    clas.classname = payload.classname;
    clas.datecreated = new Date();
    try {
      const savedClass = this.classRepository.save(clas);
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
    return `This action returns all class`;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  update(id: number, updateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
