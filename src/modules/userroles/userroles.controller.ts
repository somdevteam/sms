import { Controller, Get } from '@nestjs/common';
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
}
