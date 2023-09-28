import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tab } from '../../tabs/entities/tabs.entity'; // Import the Tab entity
import { Permission } from '../../permissions/entities/permissions.entity'; // Import the Permission entity

@Entity('tabpermissions')
export class TabPermission {
    @PrimaryGeneratedColumn({ name: 'TABIDPERMISSION' })
    tabPermissionId: number;

    // @ManyToOne(() => Tab, (tab) => tab.tabPermissions)
    tab: Tab;

    @ManyToOne(() => Permission, (permission) => permission.tabPermissions)
    permission: Permission;
}
