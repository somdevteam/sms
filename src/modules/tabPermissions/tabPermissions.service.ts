import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabPermission } from './entities/tabPermissions.entity';

@Injectable()
export class TabPermissionsService {
    constructor(
        @InjectRepository(TabPermission)
        private readonly tabPermissionsRepository: Repository<TabPermission>,
    ) {}

    async findAll(): Promise<TabPermission[]> {
        return this.tabPermissionsRepository.find();
    }
}
