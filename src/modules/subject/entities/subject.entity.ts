import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
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
}