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

 async getById(id: number): Promise<AcademicEntity> {
    const academic = await this.academicRepository.findOne({ where: { academicId: id } });
    if (!academic) {
      throw new Error('Academic not found');
    }
    return academic;
  }

  getByUsername(academicYear: string): Promise<AcademicEntity> {
    return this.academicRepository.findOne({ where: { academicYear } });
  }

  async create(payload: CreateAcademicDto) {
    const academicname = await this.getByUsername(payload.academicYear);
    if (academicname) {
      throw new NotAcceptableException(
        'The academic name currently exists. Please choose another one.',
      );
    }
    
    let academic = new AcademicEntity();
    academic.academicYear = payload.academicYear;
    academic.dateCreated = new Date();
    
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

  async update(id: number, payload:CreateAcademicDto) : Promise<AcademicEntity> {
    const academic = await this.getById(id);

    if (!academic) {
      throw new Error('Academic not found');
    }

    academic.academicYear = payload.academicYear;
    academic.isActive = payload.isActive

    return this.academicRepository.save(academic);
  }

  remove(id: number) {
    return `This action removes a #${id} academic`;
  }
}
