import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { RolesEntity } from '../../roles/entities/roles.entity';

@Entity('userroles')
export class UserRolesEntity {
    @PrimaryGeneratedColumn()
    userRoleId: number;

    @ManyToOne(() => UserEntity, (user) => user.userId)
    @JoinColumn({name:'userId'})
    user: UserEntity;

    @ManyToOne(() => RolesEntity, (roles) => roles.roleId)
    @JoinColumn({name:'roleId'})
    role: RolesEntity;
}
