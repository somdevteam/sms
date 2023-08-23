import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {isEmail, IsNotEmpty} from "class-validator";
import { Level } from "../level/entities/level.entity";
import { Levelclass } from "src/modules/levelclass/entities/levelclass.entity";

@Entity('branch')
export class Branch extends BaseEntity {
    @PrimaryGeneratedColumn()
    branchid: number;
    @Column()
    @Unique(['branchname'])
    branchname: string;
    @Column()
    branchlocation: string;
    @Column({nullable:true})
    branchlogo: string;
    @Column({nullable: true})
    coverlogo: string;
    @Column()
    datecreated: Date;
    @Column({default: true})
    isactive: boolean;
    @OneToMany(() => Levelclass, levelclass => levelclass.branch)
    levelclass: Levelclass

}