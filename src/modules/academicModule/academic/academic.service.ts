import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateAcademicDto } from './dto/create-academic.dto';
import { AcademicEntity } from './entities/academic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(AcademicEntity)
    private academicRepository: Repository<AcademicEntity>,
  ) {}

  getById(id: number): Promise<AcademicEntity> {
    return this.academicRepository.findOne({ where: { academicid: id } });
  }

  getByUsername(academicname: string): Promise<AcademicEntity> {
    return this.academicRepository.findOne({ where: { academicname } });
  }

  async create(payload: CreateAcademicDto) {
    const academicname = await this.getByUsername(payload.academicname);
    if (academicname) {
      throw new NotAcceptableException(
        'The academic name currently exists. Please choose another one.',
      );
    }
    
    let academic = new AcademicEntity();
    academic.academicname = payload.academicname;
    academic.datecreated = new Date();
    
    try {
      const savedAcademic = await this.academicRepository.save(academic); 
      return savedAcademic;

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
    return this.academicRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} academic`;
  }

  update(id: number, updateAcademicDto) {
    return `This action updates a #${id} academic`;
  }

  remove(id: number) {
    return `This action removes a #${id} academic`;
  }
}
