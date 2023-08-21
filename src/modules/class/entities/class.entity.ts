import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn()
    classid: number;
    @Column()
    classname: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;

}
