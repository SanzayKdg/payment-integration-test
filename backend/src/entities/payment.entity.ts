import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PaymentMethod, PaymentStatus } from "../types/order.types";
import { OrderedItems } from "./order.entity";

@Entity({ name: "payments" })
export class Payments {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  transaction_id: string;

  @Column({ type: "simple-json", unique: true, nullable: true })
  pidx: any;

  @Column({ type: "simple-json" })
  items: OrderedItems[];

  @Column()
  amount: number;

  @Column({ type: "simple-json" })
  data_from_verification_req: any;

  @Column({ type: "simple-json" })
  api_query_from_user: any;

  @Column({ type: "enum", enum: PaymentMethod, default: PaymentMethod.cash })
  payment_gateway: PaymentMethod;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.pending,
  })
  payment_status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
