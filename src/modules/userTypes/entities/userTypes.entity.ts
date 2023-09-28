import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usertypes')
export class UserTypesEntity {
    @PrimaryGeneratedColumn()
    userTypeId: number;

    @Column({ length: 500 })
    description: string;
}
