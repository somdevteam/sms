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

    async findRolePermissionById(roleId: number): Promise<{ roleId: number, permissionId: number, permission: string }[]> {
        const results = await this.rolePermissionsRepository
            .createQueryBuilder('rp')
            .leftJoin('rp.role', 'role')
            .leftJoin('rp.permission', 'permission')
            .select(['rp.roleId', 'rp.permissionId', 'permission.permission'])
            .where('role.roleId = :roleId', { roleId })
            .getRawMany();

        return results;
    }

    async updateRolePermission(
      rolePermissionId: number,
      rolePermissionData: Partial<RolePermissionsEntity>,
    ): Promise<RolePermissionsEntity | undefined> {
        await this.rolePermissionsRepository.update(rolePermissionId, rolePermissionData);
        return null;
    }

    async deleteRolePermission(rolePermissionId: number): Promise<void> {
        await this.rolePermissionsRepository.delete(rolePermissionId);
    }
}
