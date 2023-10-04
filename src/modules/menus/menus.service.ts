import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menus } from './entities/menus.entity';

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(Menus)
        private readonly menusRepository: Repository<Menus>,
    ) {}

    async getUserMenus(userId: number): Promise<Menus[]> {
        userId = 1;
        const query = this.menusRepository.createQueryBuilder('menus')
            .select([
                'menus.MENUID',
                'menus.MENUNAME',
                'menus.DESCRIPTION',
                'menus.PARENTID',
                'menus.ROUTE',
                'menus.MENUORDER',
                'menus.ROUTE2',
            ])
            .innerJoinAndSelect('menus.tabs', 'T')
            .innerJoinAndSelect('tabpermissions', 'TP')
            .innerJoin('ROLEPERMISSIONS', 'RP')
            .innerJoin('USERROLES', 'UR', 'UR.Userid = :userId', { userId })
             .where('menus.ISACTIVE = :isActive', { isActive: 1 })
             // .orWhere('menus.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });
        return query.getMany(); // TODO: getting all menus should be based on permission
    }
}

