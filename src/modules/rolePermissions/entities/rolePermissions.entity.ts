import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RolesEntity } from '../../roles/entities/roles.entity';
import { Permission } from '../../permissions/entities/permissions.entity';

@Entity('rolepermissions')
export class RolePermissionsEntity {
    @PrimaryGeneratedColumn()
    rolePermissionId: number;

    @ManyToOne(() => RolesEntity, (role) => role.rolePermissions)
    @JoinColumn({ name: 'roleId' })
    role: RolesEntity;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;
}
