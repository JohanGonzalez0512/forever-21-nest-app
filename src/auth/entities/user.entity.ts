import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    ManyToOne,
    OneToMany,
    OneToOne,
}
    from 'typeorm';
import { Office } from '../../offices/entities/office.entity';
import { Movement } from '../../products/entities';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', { default: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    @ManyToOne(
        () => Office,
        (office) => office.user,
        {eager: true}
    )
    office: Office;


    @OneToMany(
        () => Movement,
        (movement) => movement.user,
    )
    movement: Movement;





    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
