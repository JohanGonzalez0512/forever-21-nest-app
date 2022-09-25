import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Movement } from "./movement.entity";
import { Office } from "../../offices/entities/office.entity";

@Entity({
    name: 'products',
})
export class Product {

    @PrimaryColumn({
        unique: true,
    })
    id: number;
    @Column('text', { unique: true })
    name: string;
    @Column('text',{
        default: 'No Image',
    })
    image: string;
    @Column('int',{
        default: 0,
    })
    quantity: number;
    


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
