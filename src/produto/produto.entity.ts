import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Foto } from '../fotos/foto.entity';

@Entity()
export class Produto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100, nullable: false})
    nome: string;

    @Column({type: 'varchar', length: 200, nullable: false})
    descricao: string;

    @Column({type: 'float', nullable: false, default: 0})
    preco: number;

    @OneToMany(() => Foto, foto => foto.produto,{
        cascade: true,
        eager: true
    })
    fotos: Foto[];
}