import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()

export class Responsible extends  BaseEntity {
    @PrimaryGeneratedColumn()
    responsibleid: number;
    @Column()
    responsiblename: string;
    @Column()
    phone: number;

}
