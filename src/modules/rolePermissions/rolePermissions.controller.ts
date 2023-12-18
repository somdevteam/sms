import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import {RolePermissionsEntity} from "./entities/rolePermissions.entity";
import {RolePermissionsService} from "./rolePermissions.service";
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";


@Controller('rolePermissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  async create(@Body() rolePermissionData: Partial<RolePermissionsEntity>): Promise<RolePermissionsEntity> {
    return this.rolePermissionsService.createRolePermission(rolePermissionData);
  }

  @Get()
  async findAll(): Promise<RolePermissionsEntity[]> {
    return this.rolePermissionsService.findAllRolePermissions();
  }

  @Get('/:id')
  async findOne(@Param('id') roleId: number): Promise<ApiBaseResponse> {
    const rolerPermissions = await this.rolePermissionsService.findRolePermissionById(roleId);
    return new ApiBaseResponse('success', 200, rolerPermissions);
  }

  @Put(':id')
  async update(
    @Param('id') rolePermissionId: number,
    @Body() rolePermissionData: Partial<RolePermissionsEntity>,
  ): Promise<RolePermissionsEntity | undefined> {
    return this.rolePermissionsService.updateRolePermission(rolePermissionId, rolePermissionData);
  }

  @Delete(':id')
  async remove(@Param('id') rolePermissionId: number): Promise<void> {
    await this.rolePermissionsService.deleteRolePermission(rolePermissionId);
  }
}
