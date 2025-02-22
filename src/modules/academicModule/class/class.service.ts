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

  getByClassname(name: string): Promise<Class> {
    return this.classRepository.findOne({ where: {  classname: name } });
  }

  async getById(id: number): Promise<Class> {
    const clas =  await this.classRepository.findOne({where: {classid: id}})
    if (!clas) {
      throw new NotFoundException('class not found');
    }
    return clas;
  }

  async create(payload: CreateClassDto) {
    let classname = await this.getByClassname(payload.classname);
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

  async findAll(): Promise<Class[]> {
    return await this.classRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.levelclass', 'levelclass')
      .leftJoinAndSelect('levelclass.level', 'level')
      .orderBy('class.classId', 'ASC')
      .getMany();
  }

  async findClassesNotInLevelClassWithBranch(branchId: number): Promise<Class[]> {
    return  await this.classRepository
    .createQueryBuilder('class')
    .leftJoin('class.levelclass', 'levelClass','levelClass.branchId = :branchId', { branchId })
    .where('levelClass.classId IS NULL')
    .getMany();

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

  async getClassWithSections() {
    const classes = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.classSection', 'ClassSection')
      .leftJoinAndSelect('ClassSection.section', 'Section')
      .getMany();
      return classes;
  }

  async findAllClasses(): Promise<Class[]> {
    return await this.classRepository.createQueryBuilder('class')
      .select([
        'class.classid',
        'class.classname',
        'class.datecreated'
      ])
      .orderBy('class.classid', 'ASC')
      .getMany();
  }
}
