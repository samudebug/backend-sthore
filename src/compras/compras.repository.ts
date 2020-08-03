import { Compra } from './compra.entity';
import { Repository, EntityRepository } from 'typeorm';
import { SalvarCompraDto } from './dto/salvar-compra.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Compra)
export class ComprasRepository extends Repository<Compra> {
    public async salvarCompra(salvarCompraDto: SalvarCompraDto): Promise<Compra> {
        const compra = this.create();
        compra.emailCliente = salvarCompraDto.emailCliente;
        compra.enderecoCliente = salvarCompraDto.enderecoCliente;
        compra.nomeCliente = salvarCompraDto.nomeCliente;
        compra.paymentId = salvarCompraDto.paymentId;
        compra.produtos = salvarCompraDto.produtos;
        compra.orderCode = salvarCompraDto.compraCode;
        try {
            compra.save()
            return compra;
        } catch(error) {
            throw new InternalServerErrorException('Ocorreu um erro ao salvar no banco de dados');
        }
    }
}