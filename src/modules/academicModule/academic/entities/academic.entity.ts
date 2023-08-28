import { ClassSection } from "src/modules/academicModule/class-section/entities/class-section.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('academic')
export class AcademicEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    academicid: number;
    @Column()
    academicname: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;

    @OneToMany(() => ClassSection, clsSec => clsSec.academic)
    classSection: ClassSection

}