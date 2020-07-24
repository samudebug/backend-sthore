import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Produto } from '../produto/produto.entity';

@Entity()
export class Foto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 200, nullable: false})
    linkFoto: string;

    @ManyToOne(type => Produto, produto => produto.fotos)
    produto: Produto;
}