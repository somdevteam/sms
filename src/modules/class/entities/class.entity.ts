import { ClassSection } from "src/modules/class-section/entities/class-section.entity";
import { ClassSubject } from "src/modules/class-subject/entities/class-subject.entity";
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

    @OneToMany(() => ClassSubject, clsSub => clsSub.class)
    classSubject: ClassSubject
    @OneToMany(() => ClassSection, clsSec => clsSec.class)
    classSection: ClassSection

}
