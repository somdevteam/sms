import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBaseResponse } from '../../common/dto/apiresponses.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get(':/')
  async findAll(): Promise<ApiBaseResponse> {
    const roles = await this.roleService.findAllRoles();
    return new ApiBaseResponse('success', 200, roles);
  }
}
