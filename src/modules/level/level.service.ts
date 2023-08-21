import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  getByLevelname(levelname: string): Promise<Level> {
    return this.levelRepository.findOne({ where: { levelname } });
  }
  
  create(payload: CreateLevelDto) {
    let classname = this.getByLevelname(payload.levelname);
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

  update(id: number, updateLevelDto) {
    return `This action updates a #${id} level`;
  }

  remove(id: number) {
    return `This action removes a #${id} level`;
  }
}
