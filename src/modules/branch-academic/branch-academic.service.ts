import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AcademicBranch } from './entities/branch-academic.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicService } from '../academicModule/academic/academic.service';
import { BranchService } from '../branch/branch.service';
import { AcademicBranchDto } from './dto/create-branch-academic.dto';

@Injectable()
export class BranchAcademicService {

  constructor(
    @InjectRepository(AcademicBranch) private branchAcademicRepository: Repository<AcademicBranch>,
    private readonly branchService :BranchService,
    private readonly academicService :AcademicService,
  ) {}

  async findAcademicBranchIdByBranchAndAcademic(branchId: number, academicId: number): Promise<AcademicBranch | null> {
    const academicBranch = await this.branchAcademicRepository.findOne({
      where: { branch: { branchId }, academic: { academicId } },
    });

    if (!academicBranch) {
      throw new NotFoundException('academic with this branch not found');
    }

    return academicBranch;
  }

  async findLatestActiveBranchAcademic(branchId: number): Promise<AcademicBranch> {
    const branchAcademic = await  this.branchAcademicRepository.findOne({
      where: {
        branch :  { branchId },
        isActive: true,
      }, relations: ['academic', 'branch'], 
    });

    if (!branchAcademic) {
      throw new NotFoundException('academic with this branch not found');
    }

    return branchAcademic;
  }


  async createAcademicBranch(payload: AcademicBranchDto): Promise<AcademicBranch[]> {
    const academic = await this.academicService.getById(payload.academicId);

    try {
  
    const savedAcademicBranches = await Promise.all(
      payload.branches.map(async (branchPayload) => {
        const branch = await this.branchService.getById(branchPayload.branchId);
  
        const academicBranch = this.branchAcademicRepository.create({
          branch,
          academic,
          isActive: true,
        });
  
        return await this.branchAcademicRepository.save(academicBranch);
      })
    );
  
    return savedAcademicBranches;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException to be handled by NestJS
      }
      throw new InternalServerErrorException(
        'An error occurred while creating the academic branches.',
      );
    }
  }

  async findBranchesWithAcademicByAcademicId(academicId: number): Promise<AcademicBranch[]> {
    const queryBuilder = await this.branchAcademicRepository.createQueryBuilder('branchAcademic')
      .innerJoinAndSelect('branchAcademic.branch', 'branch')
      .innerJoinAndSelect('branchAcademic.academic', 'academic')
      .where('branchAcademic.academicId = :academicId', { academicId })
      .getMany();

    return queryBuilder;
  }
  
  findAll() {
    return `This action returns all branchAcademic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} branchAcademic`;
  }

  update(id: number, updateBranchAcademicDto: AcademicBranchDto) {
    return `This action updates a #${id} branchAcademic`;
  }

  remove(id: number) {
    return `This action removes a #${id} branchAcademic`;
  }
}
