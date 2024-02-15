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

    // async getUserMenus1(userId: number): Promise<Menus[]> {
    //     userId = 1;
    //     const query = this.menusRepository.createQueryBuilder('menus')
    //         .select([
    //             'menus.MENUID',
    //             'menus.MENUNAME',
    //             'menus.DESCRIPTION',
    //             'menus.PARENTID',
    //             'menus.ROUTE',
    //             'menus.MENUORDER',
    //             'menus.ROUTE2',
    //         ])
    //         .innerJoinAndSelect('menus.tabs', 'T')
    //         .innerJoinAndSelect('tabpermissions', 'TP')
    //         .innerJoin('ROLEPERMISSIONS', 'RP')
    //         .innerJoin('USERROLES', 'UR', 'UR.Userid = :userId', {userId})
    //         .where('menus.ISACTIVE = :isActive', {isActive: 1})
    //     // .orWhere('menus.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });
    //     return query.getMany(); // TODO: getting all menus should be based on permission
    // }
    async getUserMenusById(roleId: number): Promise<Menus[]> {
        const query = await this.menusRepository.createQueryBuilder('menus')

            .innerJoinAndSelect('menus.tabs', 'T')
            .innerJoinAndSelect('T.tabPermission', 'TP')
            .innerJoinAndSelect('TP.permission', 'p')
            .innerJoinAndSelect('p.rolePermissions', 'rp')
            .innerJoinAndSelect('rp.role','role')
            .select([
                'menus.path',
                'menus.title',
                'menus.iconType',
                'menus.icon',
                'menus.class',
                'menus.groupTitle',
                'menus.badge',
                'menus.badgeClass',
                'T.path',
                'T.title',
                'T.iconType',
                'T.icon',
                'T.class',
                'T.groupTitle',
                'T.badge',
                'T.badgeClass',
            ])
            .where('role.roleId = :roleId', {roleId: roleId})
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

    async getUserMenusById1(userId: number): Promise<Menus[]> {
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
                'menus.icon',
                'menus.class',
                'menus.groupTitle',
                'menus.badge',
                'menus.badgeClass',
                'T.path',
                'T.title',
                'T.iconType',
                'T.icon',
                'T.class',
                'T.groupTitle',
                'T.badge',
                'T.badgeClass',
            ])
            .where('u.userid = :userId', {userId: userId})
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

//     async getUserMenusById(userId: number): Promise<Menus[]> {
//         const query = `
//     SELECT
//         menus.path AS menu_path,
//         menus.title AS menu_title,
//         menus.iconType AS menu_iconType,
//         menus.icon AS menu_icon,
//         menus.class AS menu_class,
//         menus.groupTitle AS menu_groupTitle,
//         menus.badge AS menu_badge,
//         menus.badgeClass AS menu_badgeClass,
//         T.path AS tab_path,
//         T.title AS tab_title,
//         T.iconType AS tab_iconType,
//         T.icon AS tab_icon,
//         T.class AS tab_class,
//         T.groupTitle AS tab_groupTitle,
//         T.badge AS tab_badge,
//         T.badgeClass AS tab_badgeClass
//     FROM menus
//     INNER JOIN tab AS T ON menus.MENUID = T.menuId
//     INNER JOIN tabPermissions AS TP ON T.tabId = TP.tabId
//     INNER JOIN permissions AS p ON TP.permissionId = p.permissionId
//     INNER JOIN rolePermissions AS rp ON p.permissionId = rp.permissionId
//     INNER JOIN roles AS role ON rp.roleId = role.roleId
//     INNER JOIN userRoles AS u ON role.roleId = u.roleId
//     WHERE u.userid = ?;
// `;
//
//         const results = await this.menusRepository.query(query, [userId]);
//
//         // Process the results if needed
//
//         return results as Menus[];
//     }



    // async getUserMenusById(userId: number): Promise<Menus[]> {
    //     const query = await this.menusRepository.createQueryBuilder('menus')
    //
    //         .innerJoinAndSelect('menus.tabs', 'T')
    //         .innerJoinAndSelect('T.tabPermission', 'TP')
    //         .innerJoinAndSelect('TP.permission', 'p')
    //         .innerJoinAndSelect('p.rolePermissions', 'rp')
    //         .innerJoinAndSelect('rp.role','role')
    //         .innerJoinAndSelect('role.userRoles', 'u')
    //         .select([
    //             'menus.path',
    //             'menus.title',
    //             'menus.iconType',
    //             'menus.icon',
    //             'menus.class',
    //             'menus.groupTitle',
    //             'menus.badge',
    //             'menus.badgeClass',
    //             'T.path',
    //             'T.title',
    //             'T.iconType',
    //             'T.icon',
    //             'T.class',
    //             'T.groupTitle',
    //             'T.badge',
    //             'T.badgeClass',
    //         ])
    //         .where('u.userid = :userId', {userId: userId})
    //         .getMany()
    //     // .orWhere('menus.MenuId IN (SELECT DISTINCT m.Parentid FROM MENUS m, A a WHERE m.MenuId = a.Parentid AND a.MenuId != a.parentid AND m.ISACTIVE = :isActive)', { isActive: 1 });
    //     // return query.getMany(); // TODO: getting all menus should be based on permission
    //
    //     return query.map(menu => {
    //         if (menu.tabs) {
    //             menu.tabs = menu.tabs.map(tab => {
    //                 tab["submenu"] = []; // Add a newline character
    //                 return tab;
    //             });
    //             menu["submenu"] = menu.tabs;
    //             delete menu.tabs;
    //         }
    //         return menu;
    //     });
    // }


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

