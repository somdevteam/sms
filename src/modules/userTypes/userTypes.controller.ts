import { Controller, Get } from '@nestjs/common';
import { UserTypesService } from './userTypes.service';
import { ApiBaseResponse } from '../../common/dto/apiresponses.dto';

@Controller('usertypes')
export class UserTypesController {
  constructor(private readonly userTypesService: UserTypesService) {}

  @Get()
  async findAll(): Promise<ApiBaseResponse> {
    const userTypes = await this.userTypesService.findAllRoles();
    return new ApiBaseResponse('success', 200, userTypes);
  }
}
