import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
    @PrimaryGeneratedColumn()
    roleId: number;

    @Column({ length: 100 })
    roleName: string;

    @Column({ length: 500 })
    description: string;

    @Column({ default: 'Y', length: 1 })
    isActive: string;

    @Column()
    createdBy: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreated: Date;
}
