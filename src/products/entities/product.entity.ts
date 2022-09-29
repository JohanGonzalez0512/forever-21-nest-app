import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Movement } from "./movement.entity";
import { Office } from "../../offices/entities/office.entity";

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

}
