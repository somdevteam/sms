import { ClassSubject } from "src/modules/class-subject/entities/class-subject.entity";
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
@Entity('subject')
export class Subject extends BaseEntity{
    @PrimaryGeneratedColumn()
    subjectid:number;
    @Column()
    @Unique(['sectionname'])
    subjectname:string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
    @OneToMany(() => ClassSubject, clsSub => clsSub.subject)
    classSubject: ClassSubject
}