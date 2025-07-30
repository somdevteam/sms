import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { Repository } from 'typeorm';
import { BranchDTO } from './dto/branch.dto';
import { UpdateBranchDTO } from './dto/update-branch.dto';
import { CurrentUser } from 'src/common/dto/currentuser.dto';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    private readonly accountingService: AccountingService,
  ) {}

 async getById(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({ where: { branchId: id } });

    if (!branch) {
      throw new NotFoundException('branch not found');
    }

    return branch;
  }

  async findAllByBranchId(branchId: number): Promise<Branch[]> {
    return this.branchRepository.find({ where: { branchId: branchId } });
  }

  async getAllBranches(currentuser:CurrentUser,isAll:boolean) {
    const branchId = currentuser.branchId;
    if (branchId) {
      return await this.findAllByBranchId(+branchId)
    }
    
    const branchData = await this.branchRepository.find();
    
    if (!branchData) {
      return branchData;
    }

    const constantData: any[] = [
      { branchId: 0, branchName: 'All Branches' }
    ];
    const combinedData = constantData.concat(branchData);


    return isAll ? combinedData : branchData;
  }

  async getBranchByName(branchName: string): Promise<Branch> {
    try {
      return await this.branchRepository.findOne({
        where: {
          branchName: branchName,
        },
      });
    } catch (error) {
      console.error('Error fetching branch by name:', error);
      return undefined;
    }
  }

  async create(payload: BranchDTO) {
    const branchData = await this.getBranchByName(payload.branchName);
    console.log(branchData);
    if (branchData) {
      throw new NotAcceptableException(
        `the ${payload.branchName} branch currently exists`,
      );
    }

    try {
    let branch = new Branch();
    branch.branchName = payload.branchName;
    branch.branchLogo = payload.branchLogo;
    branch.coverLogo = payload.coverLogo;
    branch.isActive = payload.isactive;
    branch.branchLocation = payload.branchLocation;
    branch.dateCreated = new Date();
    
    const savedBranch = await this.branchRepository.save(branch);

    // Create default accounts for the new branch
    try {
      await this.accountingService.createDefaultAccountsForBranch(savedBranch.branchId);
    } catch (accountingError) {
      console.error('Error creating default accounts:', accountingError);
      // Don't fail branch creation if account creation fails
      // The accounts can be created manually later
    }

    return savedBranch;
    } catch (error) {
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

  async update(payload: UpdateBranchDTO): Promise<any> {
    const foundBranch = await this.branchRepository.findOneBy({
      branchId: payload.branchId,
    });

    if (!foundBranch) {
      throw new NotFoundException('Branch Not found');
    }

    try {
      foundBranch.branchName = payload.branchName;
      foundBranch.branchLocation = payload.branchLocation;
      // foundBranch.branchlogo = payload.branchLogo;
      // foundBranch.coverlogo = payload.coverLogo;

      return await this.branchRepository.update(
        foundBranch.branchId,
        foundBranch,
      );
    } catch (error) {
      if (error) {
        throw new NotAcceptableException(error);
      }
      throw new InternalServerErrorException('An error occurred while creating the user.');
    }
  }

  async remove(id: number) {
    const foundBranch = await this.branchRepository.findOneBy({
      branchId: id,
    });

    if (!foundBranch) {
      throw new NotFoundException('Branch Not found');
    }
    return this.branchRepository.delete(id);
  }
  async findBranchesWithCondition(academicId: number): Promise<any> {
    const branches = await this.branchRepository
      .createQueryBuilder('branch')
      .leftJoin('branch.academicBranches', 'academicBranch', 'academicBranch.academicId = :academicId', { academicId })
      .where('academicBranchId IS NULL')
      .select([
        'branch.branchId branchId',
        'branch.branchName branchName',
        'academicBranch.academicBranchId academicBranchId',
      ])
      .getRawMany();

    return branches;
  }

  async activeAndDeactivateBranch(branchId: number): Promise<any> {
    try {
      
      const activeBranch = await this.branchRepository.findOneBy({ isActive: true });
      const foundBranch = await this.branchRepository.findOneBy({ branchId });

      if (!foundBranch) {
          throw new NotFoundException('Branch not found');
      }

      if (activeBranch) {
          activeBranch.isActive = false;
          await this.branchRepository.update(activeBranch.branchId, activeBranch);
      }

      foundBranch.isActive = !foundBranch.isActive;
      await this.branchRepository.update(foundBranch.branchId, foundBranch);

      return foundBranch;

    } catch (error) {
      if (error) {
        throw new NotAcceptableException(error);
      }
      throw new InternalServerErrorException('An error occurred',error.message);
    }

  }


}
