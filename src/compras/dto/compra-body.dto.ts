import { Cliente } from './cliente.dto';
import { Pagamento } from './pagamento.dto';

export class CompraBodyDto {
     cliente: Cliente;
     pagamento: Pagamento;
     produtos: number[];
     valorTotal: number;
}