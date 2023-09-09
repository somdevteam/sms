import {BaseEntity, Column, Entity,PrimaryGeneratedColumn} from "typeorm";


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
}

// export class Menus extends BaseEntity{
// }