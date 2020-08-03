import { Produto } from 'src/produto/produto.entity';

export class SalvarCompraDto {
    nomeCliente: string;
    emailCliente: string;
    enderecoCliente: string;
    paymentId: string;
    produtos: Produto[];
    compraCode: string;
}