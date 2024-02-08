import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Tab} from "../../tabs/entities/tabs.entity";


@Entity()
export class Menus extends BaseEntity {
    @PrimaryGeneratedColumn()
    MENUID: number;

    @Column({ nullable: true})
    MENUNAME: string;

    @Column({ nullable: true})
    DESCRIPTION: string;

    @Column({ nullable: true})
    PARENTID: number;

    @Column({ nullable: true})
    ROUTE: string;

    @Column({ nullable: true})
    MENUORDER: number;

    @Column({ nullable: true})
    ROUTE2: string;

    @Column({ nullable: true})
    ISACTIVE: string;
    @Column({nullable:true})
    path: string;
    @Column()
    title: string;
    @Column()
    iconType: string;
    @Column({ nullable: true})
    icon: string;
    @Column()
    class: string;
    @Column({ nullable: true})
    groupTitle: string;
    @Column({ nullable: true})
    badge: string;
    @Column({ nullable: true})
    badgeClass: string;

    @OneToMany(() => Tab, (tab) => tab.Menus)
    tabs: Tab[];
}

// export class Menus extends BaseEntity{
// }
