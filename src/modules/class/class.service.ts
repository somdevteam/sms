import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateClassDto } from './dto/update-class.dto';

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

    try {
      let clas = new Class();
      clas.classname = payload.classname;
      clas.datecreated = new Date();
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

  async update(payload:UpdateClassDto) {
    let foundClass = await this.getById(payload.classid);

    if (!foundClass) {
      throw new NotFoundException('class not found');
    }

    try {

      foundClass.classname = payload.classname;
      return await this.classRepository.update(foundClass.classid,foundClass);

    }catch(error) {
      if (error) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
    



  }

 async remove(id: number) {
    let foundClass = await this.getById(id);

    if (!foundClass) {
      throw new NotFoundException('class not found');
    }
    return await this.classRepository.delete(id);
  }
}
