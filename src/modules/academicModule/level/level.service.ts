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

  async getByLevelname(name: string) {
    const className =  await this.levelRepository.findOne({ where: { levelname: name } });
    if (className) {
      throw new NotAcceptableException(
        'The level name currently exists. Please choose another one.',
      );
    }
  }

 async create(payload: CreateLevelDto) {
    await this.getByLevelname(payload.levelname);
    

    let level = new Level();
    level.levelname = payload.levelname;
    level.levelFee = payload.levelFee;
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
    return this.levelRepository.find();
  }

  async findOne(id: number): Promise<Level> {
    const foundLevel = await this.levelRepository.findOne({ where: { levelid: id } });
    if (!foundLevel) {
      throw new NotFoundException('level not found');
    }
    return foundLevel;
  }

  async update(payload: UpdateLevelDto) {
    let foundLevel = await this.findOne(payload.levelid);

    try {
      foundLevel.levelname = payload.levelname;
      foundLevel.levelFee = payload.levelFee;
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
     await this.findOne(id);
    return await this.levelRepository.delete(id);
  }
}
