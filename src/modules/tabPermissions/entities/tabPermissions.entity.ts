import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tab } from '../../tabs/entities/tabs.entity';
import { Permission } from '../../permissions/entities/permissions.entity';

@Entity('tabpermissions')
export class TabPermissions extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'tabpermissionid' })
    tabPermissionId: number;

    @ManyToOne(() => Tab, (tab) => tab.tabPermission)
    @JoinColumn({name:'tabId'})
    tab: Tab;

    @ManyToOne(() => Permission, (permission) => permission.tabPermission)
    @JoinColumn({name:'permissionId'})
    permission: Permission;
}
