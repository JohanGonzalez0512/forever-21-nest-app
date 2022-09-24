import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Product } from "./product.entity";

@Entity({
    name: 'movements',
})
export class Movement {
    @PrimaryGeneratedColumn()
    id: string;
    @Column()
    description: string;
    @Column()
    lastUpdated: Date;

    @ManyToOne(
        () => Product,
        (product) => product.movement,
    )
    product: Product;


    @ManyToOne(
        () => User,
        (user) => user.movement,
    )
    user: User;
}
