import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '../user/Dto/user.dto';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { Repository } from 'typeorm';
import { BranchDTO } from './dto/branch.dto';
import { UpdateBranchDTO } from './dto/update-branch.dto';
import { CurrentUser } from 'src/common/dto/currentuser.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
  ) {}

 async getById(id: number): Promise<Branch> {
    return await this.branchRepository.findOne({ where: { branchId: id } });
  }

  async findAllByBranchId(branchId: number): Promise<Branch[]> {
    return this.branchRepository.find({ where: { branchId: branchId } });
  }

  async getAllBranches(currentuser:CurrentUser,isAll:boolean) {
    const branchId = currentuser.profile.branchId;
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
      return await this.branchRepository.save(branch);
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
}
