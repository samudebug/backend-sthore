import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComprasRepository } from './compras.repository';
import { CompraBodyDto } from './dto/compra-body.dto';
import { CieloConstructor, Cielo, TransactionCreditCardRequestModel, EnumBrands, EnumCardType } from 'cielo';
import * as crypto from 'crypto';
import { ProdutoRepository } from '../produto/produto.repository';
import { SalvarCompraDto } from './dto/salvar-compra.dto';
import { Compra } from './compra.entity';


@Injectable()
export class ComprasService {
    private cielo: Cielo;
    constructor(
        @InjectRepository(ComprasRepository)
        private comprasRepository: ComprasRepository,
        @InjectRepository(ProdutoRepository)
        private produtoRepository: ProdutoRepository
    ) {
        const cieloParams: CieloConstructor = {
            merchantId: 'afbea4d9-7ce2-44d1-a67e-cd22ff6e4587',
            merchantKey: 'STMEGIPDMUVXPTLBSGJMMSURLRSFFXKLBDXLLIVF',
            sandbox: true
        };
        this.cielo = new Cielo(cieloParams);
    }

    private getBrand(brand: string): EnumBrands {
        switch(brand) {
            case 'visa':
                return EnumBrands.VISA
            case 'master':
                return EnumBrands.MASTER
            case 'discovery':
                return EnumBrands.DISCOVERY
            case 'elo':
                return EnumBrands.ELO
            case 'jcb':
                return EnumBrands.JCB
            case 'amex':
                return EnumBrands.AMEX
            case 'aura':
                return EnumBrands.AURA
            case 'hipercard':
                return EnumBrands.HIPERCARD
            case 'diners':
                return EnumBrands.DINERS
        }
    }

    private async capturarCompra(paymentId: string) {
        const result = await this.cielo.creditCard.captureSaleTransaction({paymentId: paymentId});
        if (result.status === 2) {
            console.log('Enviar email');
        }
    }

    public async realizarCompra(compraBodyDto: CompraBodyDto): Promise<{message: string, code: string}>{
        
        const orderId = crypto.randomBytes(3).toString('hex');
        const produtos = await Promise.all(compraBodyDto.produtos.map(async (produtoId) => {
            const produto = await this.produtoRepository.findOne(produtoId);
            return produto;
        }));
        if (produtos.some((el) => {
            return el === undefined;
        })) {
            throw new NotFoundException(`Produto inválido!`);
        }
        const vendaParams: TransactionCreditCardRequestModel = {
            customer: {
                name: compraBodyDto.cliente.nome
            },
            merchantOrderId: orderId,
            payment: {
                amount: compraBodyDto.valorTotal * 100,
                creditCard: {
                    brand: this.getBrand(compraBodyDto.pagamento.bandeira),
                    cardNumber: compraBodyDto.pagamento.numero,
                    holder: compraBodyDto.pagamento.titular,
                    expirationDate: compraBodyDto.pagamento.validade,
                    securityCode: compraBodyDto.pagamento.cvv
                },
                installments: 1,
                softDescriptor: 'Sthore',
                type: EnumCardType.CREDIT,

            }
        }
        const result = await this.cielo.creditCard.transaction(vendaParams);
        const paymentId = result.payment.paymentId;
        const salvarCompraDto: SalvarCompraDto = {
            paymentId,
            produtos,
            nomeCliente: compraBodyDto.cliente.nome,
            enderecoCliente: compraBodyDto.cliente.endereco,
            emailCliente: compraBodyDto.cliente.email,
            compraCode: orderId
        }
        const compra = await this.comprasRepository.salvarCompra(salvarCompraDto);
        // this.capturarCompra(paymentId); //Simulação para mandar para o email
        return { message: 'Operação realizada com sucesso', code: orderId };
    }

    public async getCompra(orderId: string): Promise<{valor: number, status: string}> {
        const compra = await this.comprasRepository.findOne({where: {orderCode: orderId}});
        if (!compra) throw new NotFoundException('Compra não encontrada');
        const compraInfo = await this.cielo.consult.paymentId({paymentId: compra.paymentId});
        let status = '';
        switch(compraInfo.payment.status) {
            case 0:
                status = 'Aguardando'
                break;
            case 1:
                status = 'Confirmada'
                break;
            case 2:
                status = 'Finalizada';
                break;
        }
        return {
            valor: compraInfo.payment.amount/100,
            status
        }
    }

    public async getCompras(): Promise<Compra[]> {
        const query = this.comprasRepository.createQueryBuilder('compras');
        const compras = query.getMany();
        return compras;
    }
}
