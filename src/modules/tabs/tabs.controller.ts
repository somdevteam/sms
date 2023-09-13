import { Controller, Get } from '@nestjs/common';
import { TabService } from './tabs.service';
import {ApiBaseResponse} from "../../common/dto/apiresponses.dto";

@Controller('tabs')
export class TabController {
    constructor(private readonly tabService: TabService) {}

    @Get('/')
    async findAll(): Promise<ApiBaseResponse> {
       const allTabs = await this.tabService.findAll();
        return new ApiBaseResponse ('success', 200,allTabs)
    }
}
