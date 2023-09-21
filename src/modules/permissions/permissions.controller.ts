import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get('/')
    async findAll(): Promise<ApiBaseResponse> {
       const allPermissions = await this.permissionsService.findAll();
        return new ApiBaseResponse ('success', 200,allPermissions)
    }
}
