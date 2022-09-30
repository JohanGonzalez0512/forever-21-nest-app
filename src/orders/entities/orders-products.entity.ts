import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities";
import { Order } from "./order.entity";

@Entity('orders_products')
export class Orders_products {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('int', { default: 0 })
    quantity: number;


    @ManyToOne(
        () => Product,
        product => product.orders_products)
    product: Product;
    

    @ManyToOne(
        () => Order,
        order => order.orders_products)
    order: Order;



}