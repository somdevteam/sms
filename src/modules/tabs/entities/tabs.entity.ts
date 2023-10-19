import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { Menus } from '../../menus/entities/menus.entity';
import { TabPermissions } from '../../tabPermissions/entities/tabPermissions.entity';

@Entity()
export class Tab extends BaseEntity {
    @PrimaryGeneratedColumn()
    tabId: number;

    @Column({ type: 'varchar', length: 255 })
    tabName: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    // @Column({ type: 'int' })
    // menuId: number;

    @Column({ type: 'varchar', length: 255 })
    route: string;

    @Column({ type: 'varchar', length: 255 })
    tabOrder: string;

    @Column({ type: 'varchar', length: 1 })
    preload: string;

    @Column()
    path: string;
    @Column()
    title: string;
    @Column()
    iconType: string;
    @Column()
    icon: string;
    @Column()
    class: string;
    @Column()
    groupTitle: string;
    @Column()
    badge: string;
    @Column()
    badgeClass: string;

    @ManyToOne(() => Menus, (Menus) => Menus.tabs)
    @JoinColumn({ name: 'menuId' })
    Menus: Menus;

    @OneToMany(() => TabPermissions, (tabPermission) => tabPermission.tab)
    tabPermission: TabPermissions[];
}
