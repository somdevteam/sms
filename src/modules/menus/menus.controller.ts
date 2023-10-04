// menu.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from './menus.service';
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('menus')
export class MenusController {
    constructor(private readonly MenusService: MenusService) {}

    @Get()
    async getUserMenus(@Param('userId') userId: number): Promise<ApiBaseResponse> {
        const menus = await this.MenusService.getUserMenus(userId);
        return new ApiBaseResponse('success', 200, menus);
    }
}
