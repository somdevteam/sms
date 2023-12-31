import { Levelclass } from "src/modules/academicModule/levelclass/entities/levelclass.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Level extends BaseEntity {
    @PrimaryGeneratedColumn()
    levelid: number;
    @Column()
    levelname: string;
    @Column()
    levelFee: number;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
    @OneToMany(() => Levelclass, levelclass => levelclass.level)
    levelclass: Levelclass[]

}

