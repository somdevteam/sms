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
    return await this.branchRepository.findOne({ where: { branchid: id } });
  }

  async findAllByBranchId(branchId: number): Promise<Branch[]> {
    return this.branchRepository.find({ where: { branchid: branchId } });
  }

  async getAllBranches(currentuser:CurrentUser) {
    const branchId = currentuser.profile.branchId;
    if (branchId) {
      return await this.findAllByBranchId(+branchId)
    }
    const constantData: any[] = [
      { branchid: 0, branchname: 'All Branches' }
    ];
    const branchData = await this.branchRepository.find();
    if (!branchData) {
      return branchData;
    }
    const combinedData = constantData.concat(branchData);
    return combinedData;
  }

  async getBranchByName(branchName: string): Promise<Branch> {
    try {
      return await this.branchRepository.findOne({
        where: {
          branchname: branchName,
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

    let branch = new Branch();
    branch.branchname = payload.branchName;
    branch.branchlogo = payload.branchLogo;
    branch.coverlogo = payload.coverLogo;
    branch.isactive = payload.isactive;
    branch.branchlocation = payload.branchLocation;
    branch.datecreated = new Date();

    try {
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
      branchid: payload.branchId,
    });

    if (!foundBranch) {
      throw new NotFoundException('Branch Not found');
    }

    try {
      foundBranch.branchname = payload.branchName;
      foundBranch.branchlocation = payload.branchLocation;
      // foundBranch.branchlogo = payload.branchLogo;
      // foundBranch.coverlogo = payload.coverLogo;

      return await this.branchRepository.update(
        foundBranch.branchid,
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
      branchid: id,
    });

    if (!foundBranch) {
      throw new NotFoundException('Branch Not found');
    }
    return this.branchRepository.delete(id);
  }
}
