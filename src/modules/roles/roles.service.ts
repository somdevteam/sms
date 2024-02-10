import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';

@Injectable()
export class RolesService {
    constructor(
      @InjectRepository(RolesEntity)
      private readonly rolesRepository: Repository<RolesEntity>,
    ) {}

    async getRoleById(id: number): Promise<RolesEntity> {
      const role = await this.rolesRepository.findOne({ where: { roleId: id } });
  
      if (!role) {
        throw new NotFoundException('role not found');
      }
  
      return role;
    }

    async findAllRoles(): Promise<RolesEntity[]> {
        return await this.rolesRepository.find();
    }
}
