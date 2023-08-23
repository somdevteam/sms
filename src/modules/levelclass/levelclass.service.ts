import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelclassDto } from './dto/create-levelclass.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Levelclass } from './entities/levelclass.entity';
import { Repository } from 'typeorm';
import { BranchService } from '../branch/branch.service';
import { LevelService } from '../level/level.service';
import { ClassService } from '../class/class.service';

@Injectable()
export class LevelclassService {

  constructor(
    @InjectRepository(Levelclass) private levelclassRepository: Repository<Levelclass>,
    private readonly branchService :BranchService,
    private readonly levelService :LevelService,
    private readonly classService :ClassService,
  ) {}
  
  async create(payload: CreateLevelclassDto) {
   const branch = await this.branchService.getById(payload.branchid);
   if (!branch) {
    throw new NotFoundException(`branch with ID ${payload.branchid} not found`)
   }

   const level = await this.levelService.getById(payload.levelid);
   if (!level) {
    throw new NotFoundException(`level with ID ${payload.levelid} not found`)
   }

   const clas = await this.classService.getById(payload.classid);
   if (!clas) {
    throw new NotFoundException(`class with ID ${payload.classid} not found`)
   }

    let lvlclass = new Levelclass();
    lvlclass.branch = branch;
    lvlclass.level = level;
    lvlclass.class = clas;

    return await this.levelclassRepository.save(lvlclass);
  }

  findAll() {
    return `This action returns all levelclass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} levelclass`;
  }

  update(id: number, updateLevelclassDto) {
    return `This action updates a #${id} levelclass`;
  }

  remove(id: number) {
    return `This action removes a #${id} levelclass`;
  }
}
