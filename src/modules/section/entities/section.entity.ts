import { Levelclass } from "src/modules/levelclass/entities/levelclass.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Section extends BaseEntity {
    @PrimaryGeneratedColumn()
    sectionid:number;
    @Column()
    @Unique(['sectionname'])
    sectionname:string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
}
