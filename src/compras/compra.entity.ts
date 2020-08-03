import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column } from 'typeorm';
import { Produto } from 'src/produto/produto.entity';

@Entity()
export class Compra extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Produto)
    @JoinTable()
    produtos: Produto[];

    @Column({type: 'varchar', length: 100, nullable: false})
    paymentId: string;

    @Column({type: 'varchar', length: 200, nullable: false})
    emailCliente: string;

    @Column({type: 'varchar', length: 200, nullable: false})
    nomeCliente: string;
    
    @Column({type: 'varchar', length: 200, nullable: false})
    enderecoCliente: string;

    @Column({type: 'varchar', length: 6, nullable: false, default: ''})
    orderCode: string;
}