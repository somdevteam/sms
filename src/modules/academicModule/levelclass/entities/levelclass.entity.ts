import { Branch } from "src/modules/branch/branch.entity";
import { Class } from "src/modules/academicModule/class/entities/class.entity";
import { Level } from "src/modules/academicModule/level/entities/level.entity";
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Levelclass extends BaseEntity {
    @PrimaryGeneratedColumn()
    levelclassid: number;

    @ManyToOne(() => Branch, branch => branch.levelclass)
    @JoinColumn({name: 'branchid'}) // Specify the foreign key column
    branch: Branch;

    @ManyToOne(() => Level, lvl => lvl.levelclass)
    @JoinColumn({name: 'levelid'}) // Specify the foreign key column
    level: Level;

    @ManyToOne(() => Class, cls => cls.levelclass)
    @JoinColumn({name: 'classid'}) // Specify the foreign key column
    class: Class;

    
}
