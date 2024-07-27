import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentStates {
  @PrimaryGeneratedColumn()
  paymentstateid: number;

  @Column()
  description: string;

}
