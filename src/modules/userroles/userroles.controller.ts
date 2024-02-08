import {Controller, Get, Param} from '@nestjs/common';
import { UserRolesService } from './userroles.service';
import { ApiBaseResponse } from '../../common/dto/apiresponses.dto';

@Controller('userroles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  async findAll(): Promise<ApiBaseResponse> {
    const userRoles = await this.userRolesService.findAllUserRoles();
    return new ApiBaseResponse('success', 200, userRoles);
  }

  @Get('/:id')
  async find(@Param('id') id): Promise<ApiBaseResponse> {
    const userRoles = await this.userRolesService.findUserRolesByUserId(id);
    return new ApiBaseResponse('success', 200, userRoles);
  }
}
