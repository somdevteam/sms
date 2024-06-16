import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
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

  async findActiveBranchAcademic(branchId: number): Promise<AcademicBranch> {
    const branchAcademic = await  this.branchAcademicRepository.findOne({
      where: {
        branch :  { branchId ,isActive: true},
        academic: {isActive: true},
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

  async findBranchesByAcademicId(academicId: number): Promise<AcademicBranch[]> {
    const queryBuilder = await this.branchAcademicRepository.createQueryBuilder('branchAcademic')
      .innerJoinAndSelect('branchAcademic.branch', 'branch')
      .innerJoinAndSelect('branchAcademic.academic', 'academic')
      .where('branchAcademic.academicId = :academicId', { academicId })
      .getMany();

    return queryBuilder;
  }

  async findAcademicByBranch(branchId: number): Promise<any> {
    const result =  await this.branchAcademicRepository.find({
       where: {branch: {branchId}},
       relations: ['academic','branch'],
     })

     // Filter out any objects where isActive is not true
    // const filteredResult = result.filter(item => item.isActive === true);
    return result;
   }

   async activeAndDeactivateBranchAcademic(payload: any): Promise<any> {
    try {
      
      const activeBranchAcademic = await this.branchAcademicRepository.findOneBy({
         academic: {academicId: payload.academicId},
         branch: {branchId: payload.branchId},
         isActive: true 
        });

      const foundBranchAcademicBranch = await this.branchAcademicRepository.findOneBy({ 
        academic: {academicId: payload.academicId},
        branch: {branchId: payload.branchId}
       });

      if (!foundBranchAcademicBranch) {
          throw new NotFoundException('Branch Academic not found');
      }

      if (activeBranchAcademic) {
        activeBranchAcademic.isActive = false;
          await this.branchAcademicRepository.update(activeBranchAcademic.academicBranchId, activeBranchAcademic);
      }

      foundBranchAcademicBranch.isActive = !foundBranchAcademicBranch.isActive;
      await this.branchAcademicRepository.update(foundBranchAcademicBranch.academicBranchId, foundBranchAcademicBranch);

      return foundBranchAcademicBranch;

    } catch (error) {
      if (error) {
        throw new NotAcceptableException(error);
      }
      throw new InternalServerErrorException('An error occurred',error.message);
    }

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
