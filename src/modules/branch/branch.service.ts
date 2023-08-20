import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException
} from '@nestjs/common';
import {UserDto} from "../user/Dto/user.dto";
import crypto from "crypto";
import {InjectRepository} from "@nestjs/typeorm";
import {Branch} from "./branch.entity";
import {Repository} from "typeorm";
import {BranchDTO} from "./dto/branch.dto";

@Injectable()
export class BranchService {
    constructor(@InjectRepository(Branch) private branchRepository:Repository<Branch>) {
    }
    getAllBranches() {
        return this.branchRepository.find();
    }

    async create(payload: BranchDTO) {
        const branchData = await this.getBranchByName(payload.branchName);
        console.log(branchData);
        if (branchData) {
            throw new NotAcceptableException(
                'The account with the provided branch currently exists. Please choose another one.',
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
                throw new ConflictException('The provided branch name is already associated.' + error.messages);
            }
            throw new InternalServerErrorException('An error occurred while creating the branch.');
        }
    }
    
    async  getBranchByName(branchName: string): Promise<Branch> {

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

}
