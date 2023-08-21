import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class AcademicEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    academicid: number;
    @Column()
    academicname: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;

}