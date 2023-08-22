import { Inject, Injectable } from '@nestjs/common';
import { CreateLevelclassDto } from './dto/create-levelclass.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Levelclass } from './entities/levelclass.entity';
import { Repository } from 'typeorm';
import { BranchService } from '../branch/branch.service';

@Injectable()
export class LevelclassService {

  constructor(
    @Inject(BranchService) private branchService :BranchService,
    @InjectRepository(Levelclass)
    private levelRepository: Repository<Levelclass>,
  ) {}
  
  async create(payload: CreateLevelclassDto) {
   const branch = await this.branchService.getById(payload.branchid);
   return branch;
    return 'This action adds a new levelclass';
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
