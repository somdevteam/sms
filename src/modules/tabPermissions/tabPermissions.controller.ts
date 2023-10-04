import { Controller, Get } from '@nestjs/common';
import { TabPermissionsService } from './tabPermissions.service';
import { ApiBaseResponse } from '../../common/dto/apiresponses.dto';

@Controller('tabpermissions')
export class TabPermissionsController {
    constructor(private readonly tabPermissionsService: TabPermissionsService) {}

    @Get('/')
    async findAll(): Promise<ApiBaseResponse> {
       const allPermissions = await this.tabPermissionsService.findAll();
        return new ApiBaseResponse ('success', 200,allPermissions)
    }
}
