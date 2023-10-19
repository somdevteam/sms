import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Menus} from './entities/menus.entity';

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(Menus)
        private readonly menusRepository: Repository<Menus>,
    ) {
    }

    async getUserMenus1(userId: number): Promise<Menus[]> {
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
            .innerJoin('USERROLES', 'UR', 'UR.Userid = :userId', {userId})
            .where('menus.ISACTIVE = :isActive', {isActive: 1})
        // .orWhere('menus.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });
        return query.getMany(); // TODO: getting all menus should be based on permission
    }

    async getUserMenus(userId: number): Promise<Menus[]> {
        userId = 1;
        const query = await this.menusRepository.createQueryBuilder('menus')

            .innerJoinAndSelect('menus.tabs', 'T')
            .innerJoinAndSelect('T.tabPermission', 'TP')
            .innerJoinAndSelect('TP.permission', 'p')
            .innerJoinAndSelect('p.userPermissions', 'up')
            .innerJoinAndSelect('up.user', 'u')
            .select([
                'menus.path',
                'menus.title',
                'menus.iconType',
                'menus.class',
                'menus.groupTitle',
                'menus.badge',
                'menus.badgeClass',
                'T.path',
                'T.title',
                'T.iconType',
                'T.class',
                'T.groupTitle',
                'T.badge',
                'T.badgeClass',
            ])
            .where('u.userid = :userId', {userId: 1})
            .getMany()
        // .orWhere('menus.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });
        // return query.getMany(); // TODO: getting all menus should be based on permission

        return query.map(menu => {
            if (menu.tabs) {
                menu.tabs = menu.tabs.map(tab => {
                    tab["submenu"] = []; // Add a newline character
                    return tab;
                });
              menu["submenu"] = menu.tabs;
              delete menu.tabs;
            }
            return menu;
          });
    }

    async getUserMenus3(userId: number): Promise<Menus[]> {
        userId = 1;
        const query = this.menusRepository.createQueryBuilder('menus')

            .innerJoinAndSelect('menus.tabs', 'T')
            .innerJoinAndSelect('T.tabPermission', 'TP')
            .innerJoinAndSelect('TP.permission', 'p')
            .innerJoinAndSelect('p.userPermissions', 'up')
            .innerJoinAndSelect('up.user', 'u')
            .select([
                'menus.MENUID',
                'menus.MENUNAME',
                'menus.DESCRIPTION',
                'menus.PARENTID',
                'menus.ROUTE',
                'menus.MENUORDER',
                'menus.ROUTE2',
            ])
            .where('u.userid = :userId', {userId: 1})
        // .orWhere('menus.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });
        return query.getMany(); // TODO: getting all menus should be based on permission
    }
}

