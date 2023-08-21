import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Level extends BaseEntity {
    @PrimaryGeneratedColumn()
    levelid: number;
    @Column()
    levelname: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;

}

