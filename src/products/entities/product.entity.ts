import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Movement } from "./movement.entity";
import { Office } from "../../offices/entities/office.entity";

@Entity({
    name: 'products',
})
export class Product {

    @PrimaryColumn()
    id: number;
    @Column('text', { unique: true })
    name: string;
    @Column()
    image: string;
    @Column()
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
