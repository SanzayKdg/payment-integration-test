import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types/order.types";

export interface OrderedItems {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

@Entity({ name: "orders" })
export class Orders {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "simple-json" })
  items: OrderedItems[];

  @Column()
  total_amount: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.cash,
  })
  payment_method: PaymentMethod;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.pending })
  payment_status: PaymentStatus;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.processing })
  order_status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
