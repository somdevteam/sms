import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Tab} from "../../tabs/entities/tabs.entity";


@Entity()
export class Menus extends BaseEntity{
    @PrimaryGeneratedColumn()
    MENUID: number;

    @Column()
    MENUNAME: string;

    @Column()
    DESCRIPTION: string;

    @Column()
    PARENTID: number;

    @Column()
    ROUTE: string;

    @Column()
    MENUORDER: number;

    @Column()
    ROUTE2: string;

    @Column()
    ISACTIVE: string;
    // Add other columns as needed

    @OneToMany(() => Tab, (tab) => tab.Menus)
    tabs: Tab[];
}

// export class Menus extends BaseEntity{
// }
