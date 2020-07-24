import { Foto } from 'src/fotos/foto.entity';

export class CriarProdutoDto {
    nome: string;
    descricao: string;
    preco: number;
    fotos: Foto[];
}