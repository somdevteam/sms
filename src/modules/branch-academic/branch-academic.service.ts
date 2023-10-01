import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateBranchAcademicDto } from './dto/update-branch-academic.dto';
import { BranchAcademicDto } from './dto/create-branch-academic.dto';
import { BranchAcademic } from './entities/branch-academic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicService } from '../academicModule/academic/academic.service';
import { BranchService } from '../branch/branch.service';

@Injectable()
export class BranchAcademicService {

  constructor(
    @InjectRepository(BranchAcademic) private branchAcademicRepository: Repository<BranchAcademic>,
    private readonly branchService :BranchService,
    private readonly academicService :AcademicService,
  ) {}


  async findByBranchIdAndAcademicId(branchId: any, academicId: any): Promise<BranchAcademic | null> {
    const branchAcademic = await this.branchAcademicRepository.findOne({
      where: {
        branch: branchId,
        academic: academicId,
      },
    });
  
    if (!branchAcademic) {
      throw new NotFoundException('BranchAcademic not found');
    }
  
    return branchAcademic;
  }
  
  
  
 async create(payload: BranchAcademicDto) {

    const branch = await this.branchService.getById(payload.branchId);
    if (!branch) {
     throw new NotFoundException(`branch with ID ${payload.branchId} not found`)
    }
 

    const academic = await this.academicService.getById(payload.academicId);
    if (!academic) {
     throw new NotFoundException(`academic with ID ${payload.academicId} not found`)
    }

    try {

      const branchAcademic = new BranchAcademic();
      branchAcademic.branch = branch;
      branchAcademic.academic = academic;
  
      return await this.branchAcademicRepository.save(branchAcademic);

    }catch(error) {
      if (error) {
        throw new ConflictException(
          'The provided branch name is already associated.' + error.messages,
        );
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the branch.',
      );
    }
    }
  

  findAll() {
    return `This action returns all branchAcademic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} branchAcademic`;
  }

  update(id: number, updateBranchAcademicDto: UpdateBranchAcademicDto) {
    return `This action updates a #${id} branchAcademic`;
  }

  remove(id: number) {
    return `This action removes a #${id} branchAcademic`;
  }
}
