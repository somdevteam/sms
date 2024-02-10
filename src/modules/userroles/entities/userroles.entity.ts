import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { RolesEntity } from '../../roles/entities/roles.entity';

@Entity('userroles')
export class UserRolesEntity {
    @PrimaryGeneratedColumn()
    userRoleId: number;

    @OneToOne(() => UserEntity, (user) => user.userRoles)
    @JoinColumn({name:'userId'})
    user: UserEntity;

    @ManyToOne(() => RolesEntity, (roles) => roles.userRoles)
    @JoinColumn({name:'roleId'})
    role: RolesEntity;
}
