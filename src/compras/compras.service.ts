import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComprasRepository } from './compras.repository';
import { CompraBodyDto } from './dto/compra-body.dto';
import { CieloConstructor, Cielo, TransactionCreditCardRequestModel, EnumBrands, EnumCardType } from 'cielo';
import * as crypto from 'crypto';
import { ProdutoRepository } from 'src/produto/produto.repository';
import { SalvarCompraDto } from './dto/salvar-compra.dto';
import { stat } from 'fs';


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
            if (!produto) throw new NotFoundException(`Produto inválido! id: ${produtoId}`);
            return produto;
        }));
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
                    expirationDate: compraBodyDto.pagamento.validade
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
        await this.comprasRepository.salvarCompra(salvarCompraDto);
        this.capturarCompra(paymentId);
        return { message: 'Operação realizada com sucesso', code: orderId };
    }

    public async getCompra(orderId: string): Promise<{valor: number, status: string}> {
        const compra = await this.comprasRepository.findOne({where: {orderCode: orderId}});
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
}
