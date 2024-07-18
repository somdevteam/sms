import {ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Levelclass} from './entities/levelclass.entity';
import {Repository} from 'typeorm';
import {UpdateLevelclassDto} from './dto/update-levelclass.dto';
import { BranchService } from 'src/modules/branch/branch.service';
import { LevelService } from '../level/level.service';
import { ClassService } from '../class/class.service';
import { LevelClassDto } from './dto/level-class.dto';
import { BranchLevel } from './dto/branch-class.dto';

@Injectable()
export class LevelclassService {

  constructor(
    @InjectRepository(Levelclass) private levelclassRepository: Repository<Levelclass>,
    private readonly branchService :BranchService,
    private readonly levelService :LevelService,
    private readonly classService :ClassService,
  ) {}

  async createLevelClass(payload: LevelClassDto) {
    const { branchid, classid, levelid } = payload;

    const branch = await this.branchService.getById(branchid);

   const level = await this.levelService.findOne(levelid);


    const newLevelclasses = await Promise.all(classid.map(async (data)  => {
      const clas = await  this.classService.getById(data.classid);

      await this.isExistingLevelclass(1,1,4);

      const levelclass = new Levelclass();
      levelclass.branch = branch;
      levelclass.class = clas;
      levelclass.level = level;

      return levelclass;
    }));

    await this.levelclassRepository.save(newLevelclasses);
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

  async isExistingLevelclass(branchId:number,levelId:number,classId:number) {
    const existingLevelclass = await this.levelclassRepository.findOne({
      where: {
        branch: { branchId },
        class: { classid: classId }, // Assuming you check for the first class only
        level: { levelid: levelId },
      },
    });

    if (existingLevelclass) {
      throw new NotAcceptableException('Levelclass already exists with the same branch, class, and level.')
    }

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

  async getLevelsByBranch(branchId: number): Promise<any>{
    return await this.levelclassRepository
    .createQueryBuilder('lc')
    .innerJoin('lc.level', 'l')
    .innerJoin('lc.class', 'c')
    .innerJoin('lc.branch', 'b')
    .select([
      'DISTINCT l.levelid as levelId', 
      'l.levelname as levelName',
    ]) 
    .where('b.branchId = :branchId', { branchId })
    .getRawMany();
  }

  async getClassesByBranchAndLevel(payload: BranchLevel): Promise<any>{
    return await this.levelclassRepository.find({
      relations: ['level','class','branch'],
      where: {branch: {branchId: payload.branchId},level: {levelid: payload.levelId}}
    })
  }
  

  async getLevelClassesWithLevel1(levelId: number) {
    return await this.levelclassRepository
      .createQueryBuilder('lc')
      .innerJoin('lc.level', 'l')
      .innerJoinAndSelect('lc.class', 'c')
      .innerJoin('lc.branch', 'b')
      .where('l.levelid = :levelId', { levelId })
      .getMany();
  }
}
