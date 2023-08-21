import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

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
