import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Tab } from '../../tabs/entities/tabs.entity'; // Import the Tab entity
import { Permission } from '../../permissions/entities/permissions.entity'; // Import the Permission entity

@Entity('tabpermissions')
export class TabPermission {
    @PrimaryGeneratedColumn({ name: 'tabpermissionid' })
    tabPermissionId: number;

    @ManyToOne(() => Tab, (tab) => tab.tabPermission)
    @JoinColumn({name:'tabid'})
    tab: Tab;

    @ManyToOne(() => Permission, (permission) => permission.tabPermission)
    @JoinColumn({name:'permissionId'})
    permission: Permission;
}
