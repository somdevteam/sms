import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTypesEntity } from './entities/userTypes.entity';

@Injectable()
export class UserTypesService {
    constructor(
      @InjectRepository(UserTypesEntity)
      private readonly userTypesRepository: Repository<UserTypesEntity>,
    ) {}

    async findAllRoles(): Promise<UserTypesEntity[]> {
        return await this.userTypesRepository.find();
    }
}
