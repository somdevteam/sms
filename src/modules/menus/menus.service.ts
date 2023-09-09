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
        return await this.menusRepository.find();
        // const query = this.menusRepository.createQueryBuilder('menu')
        //     .select([
        //         'menu.MENUID',
        //         'menu.MENUNAME',
        //         'menu.DESCRIPTION',
        //         'menu.PARENTID',
        //         'menu.ROUTE',
        //         'menu.MENUORDER',
        //         'menu.ROUTE2',
        //     ])
            // .innerJoin('menu.TABS', 'T')
            // .innerJoin('T.TABPERMISSIONS', 'TP')
            // .innerJoin('TP.ROLEPERMISSIONS', 'RP')
            // .innerJoin('RP.USERROLES', 'UR', 'UR.Userid = :userId', { userId })
            // .where('menu.ISACTIVE = :isActive', { isActive: 1 })
            // .orWhere('menu.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });

        // return query.getMany(); // TODO: getting all menus should be based on permission
    }
}

