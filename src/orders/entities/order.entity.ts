import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Office } from '../../offices/entities/office.entity';
import { Orders_products } from './orders-products.entity';

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date', { default: () => 'CURRENT_DATE' })
    date: Date;

    @Column('bool', { default: false })
    status: boolean;


    @ManyToOne(
        () => User,
        user => user.order)
    user: User;

    @ManyToOne(
        () => Office,
        office => office.order)
    office: Office;

    @OneToMany(
        () => Orders_products,
        orders_products => orders_products.order)
    orders_products: Orders_products;




}
