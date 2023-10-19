import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {RolePermissionsEntity} from "./entities/rolePermissions.entity";


@Injectable()
export class RolePermissionsService {
    constructor(
      @InjectRepository(RolePermissionsEntity)
      private readonly rolePermissionsRepository: Repository<RolePermissionsEntity>,
    ) {}

    async createRolePermission(rolePermissionData: Partial<RolePermissionsEntity>): Promise<RolePermissionsEntity> {
        const rolePermission = this.rolePermissionsRepository.create(rolePermissionData);
        return await this.rolePermissionsRepository.save(rolePermission);
    }

    async findAllRolePermissions(): Promise<RolePermissionsEntity[]> {
        return await this.rolePermissionsRepository.find();
    }

    async findRolePermissionById(rolePermissionId: number): Promise<RolePermissionsEntity | undefined> {
        return await this.rolePermissionsRepository.findOne({where:{rolePermissionId}});
    }

    async updateRolePermission(
      rolePermissionId: number,
      rolePermissionData: Partial<RolePermissionsEntity>,
    ): Promise<RolePermissionsEntity | undefined> {
        await this.rolePermissionsRepository.update(rolePermissionId, rolePermissionData);
        return this.findRolePermissionById(rolePermissionId);
    }

    async deleteRolePermission(rolePermissionId: number): Promise<void> {
        await this.rolePermissionsRepository.delete(rolePermissionId);
    }
}
