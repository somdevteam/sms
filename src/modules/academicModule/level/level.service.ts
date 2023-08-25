import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  getByLevelname(name: string): Promise<Level> {
    return this.levelRepository.findOne({ where: { levelname: name } });
  }

  getById(id: number): Promise<Level> {
    return this.levelRepository.findOne({ where: { levelid: id } });
  }

 async create(payload: CreateLevelDto) {
    let classname = await this.getByLevelname(payload.levelname);
    if (classname) {
      throw new NotAcceptableException(
        'The level name currently exists. Please choose another one.',
      );
    }

    let level = new Level();
    level.levelname = payload.levelname;
    level.datecreated = new Date();
    try {
      const savedClass = this.levelRepository.save(level);
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

  async update(payload: UpdateLevelDto) {
    let foundLevel = await this.getById(payload.levelid);

    if (!foundLevel) {
      throw new NotFoundException('level not found');
    }

    try {
      foundLevel.levelname = payload.levelname;
      return await this.levelRepository.update(foundLevel.levelid, foundLevel);
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
    let foundlevel = await this.getById(id);

    if (!foundlevel) {
      throw new NotFoundException('level not found');
    }
    return await this.levelRepository.delete(id);
  }
}
