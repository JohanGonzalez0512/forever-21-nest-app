import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Movement } from "./movement.entity";
import { Office } from "../../offices/entities/office.entity";
import { Orders_products } from '../../orders/entities/orders-products.entity';

@Entity({
    name: 'products',
})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @Column('text',{
        default: 'No Image',
    })
    imageURL: string;

    @Column('int',{
        default: 0,
    })
    quantity: number;
    
    @Column('text')
    SKU: string;


    @Column()
    creationDate: Date;
    
    @ManyToOne(
        () => Office,
        (office) => office.product,
    )
    office: Office;


    @OneToMany(
        () => Movement,
        (movement) => movement.product,
    )
    movement: Movement;

    @OneToMany(
        () => Orders_products,
        (orders_products) => orders_products.product,
    )
    orders_products: Orders_products;

}
