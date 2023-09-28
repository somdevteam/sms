import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';

@Injectable()
export class RolesService {
    constructor(
      @InjectRepository(RolesEntity)
      private readonly rolesRepository: Repository<RolesEntity>,
    ) {}

    async findAllRoles(): Promise<RolesEntity[]> {
        return await this.rolesRepository.find();
    }
}
