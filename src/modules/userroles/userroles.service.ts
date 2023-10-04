import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRolesEntity } from './entities/userroles.entity';

@Injectable()
export class UserRolesService {
    constructor(
      @InjectRepository(UserRolesEntity)
      private readonly userRolesRepository: Repository<UserRolesEntity>,
    ) {}

    async findAllUserRoles(): Promise<UserRolesEntity[]> {
        return await this.userRolesRepository.find();
    }
}
