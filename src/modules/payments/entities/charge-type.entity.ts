import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentChargeRequest } from "./payment-charge-request.entity";

@Entity()
export class ChargeType extends BaseEntity {
    @PrimaryGeneratedColumn()
    chargeTypeId: number;

    @Column()
    name: string;

    @Column()
    chargeTypeCode: string;

    @Column()
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => PaymentChargeRequest, charge => charge.chargeType)
    charges: PaymentChargeRequest[];
} 
