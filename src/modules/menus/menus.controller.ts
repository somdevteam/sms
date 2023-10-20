// menu.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from './menus.service';
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    // @Get()
    // async getUserMenus(@Param('userId') userId: number): Promise<ApiBaseResponse> {
    //     const menus = await this.MenusService.getUserMenus(userId);
    //     return new ApiBaseResponse('success', 200, menus);
    // }

    @Get(':userId')
    async getUserMenus(@Param('userId') userId: number): Promise<ApiBaseResponse> {
        console.log("userid"+userId);
        const menus = await this.menusService.getUserMenusById(userId);
        return new ApiBaseResponse('success', 200, menus);
    }
}
