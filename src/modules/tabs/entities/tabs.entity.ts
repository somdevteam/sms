import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Menus } from '../../menus/entities/menus.entity';

@Entity()
export class Tab {
    @PrimaryGeneratedColumn()
    tabId: number;

    @Column({ type: 'varchar', length: 255 })
    tabName: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'int' })
    menuId: number;

    @Column({ type: 'varchar', length: 255 })
    route: string;

    @Column({ type: 'varchar', length: 255 })
    tabOrder: string;

    @Column({ type: 'varchar', length: 1 })
    preload: string;

    @ManyToOne(() => Menus, (Menus) => Menus.tabs)
    @JoinColumn({ name: 'menuId' })
    Menus: Menus;
}
