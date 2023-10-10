import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {CreateLevelclassDto} from './dto/create-levelclass.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Levelclass} from './entities/levelclass.entity';
import {Repository} from 'typeorm';
import {UpdateLevelclassDto} from './dto/update-levelclass.dto';
import { BranchService } from 'src/modules/branch/branch.service';
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

   const level = await this.levelService.findOne(payload.levelid);

   const clas = await this.classService.getById(payload.classid);

    let lvlclass = new Levelclass();
    lvlclass.branch = branch;
    lvlclass.level = level;
    lvlclass.class = clas;

    return await this.levelclassRepository.save(lvlclass);
  }

  findAll() {
    return this.levelclassRepository.find();
  }

  async findOne(id: number): Promise<Levelclass> {
    const levelClass = await this.levelclassRepository.findOne({ where: { levelclassid: id } });
    if (!levelClass) {
      throw new NotFoundException(`Level class with ${id} not found`)
    }
    return levelClass;
  }

 async update( payload: UpdateLevelclassDto) {
    const foundclasslevel = await this.findOne(payload.levelclassid);
    if (!foundclasslevel) {
      throw new NotFoundException(`level class with id ${payload.levelclassid} not found`);
    }

    const branch = await this.branchService.getById(payload.branchid);
    if (!branch) {
     throw new NotFoundException(`branch with ID ${payload.branchid} not found`)
    }
 
    const level = await this.levelService.findOne(payload.levelid);
    if (!level) {
     throw new NotFoundException(`level with ID ${payload.levelid} not found`)
    }
 
    const clas = await this.classService.getById(payload.classid);
    if (!clas) {
     throw new NotFoundException(`class with ID ${payload.classid} not found`)
    }

    try {
      foundclasslevel.branch = branch;
      foundclasslevel.level = level;
      foundclasslevel.class = clas;
      return await this.levelclassRepository.update(foundclasslevel.levelclassid,foundclasslevel);
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
    const foundclasslevel = await this.findOne(id);
    if (!foundclasslevel) {
      throw new NotFoundException(`level class with id ${id} not found`);
    }
    return await this.levelclassRepository.delete(id);
  }

  async getLevelClassesWithLevel(levelId: number) {
    return await this.levelclassRepository
      .createQueryBuilder('Levelclass')
      .innerJoin('Levelclass.level', 'level')
      .innerJoinAndSelect('Levelclass.class', 'class')
      .innerJoin('Levelclass.branch', 'branch')
      .where('level.levelid = :levelId', { levelId })
      .getMany();
      
  }

    async fetchClassesByBranchId(branchId: number) :Promise<any>{
      const levelId = 1;
        return await this.levelclassRepository
            .createQueryBuilder('levelClass')
            .leftJoinAndSelect('levelClass.branch', 'branch')
            .leftJoinAndSelect('levelClass.class', 'class')
            .leftJoinAndSelect('levelClass.level', 'level')
            .where('levelClass.branch = :branchId', {branchId})
            .andWhere('level.levelid = :levelId', {levelId})
            .andWhere('class.isactive = :isActive', {isActive:true})
            .select([
                'class.classid',
                'class.classname',
                'class.datecreated',
                'class.isactive',
            ])
            .getRawMany();
    }
}
