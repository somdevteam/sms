import { Levelclass } from "src/modules/levelclass/entities/levelclass.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    @OneToMany(() => Levelclass, levelclass => levelclass.class)
    levelclass: Levelclass

}
