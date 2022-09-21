import { User } from "../../auth/entities/user.entity";

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: 'offices'
})
export class Office {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    name: string;

    @OneToMany(
        () => User,
        (user) => user.office,
        { onDelete: 'CASCADE' }
    )
    user: User;




}
