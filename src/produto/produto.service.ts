import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoRepository } from './produto.repository';
import { CriarProdutoBodyDto } from './dto/criar-produto-body.dto';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { Foto } from 'src/fotos/foto.entity';
import { Produto } from './produto.entity';
import { FotosRepository } from 'src/fotos/fotos.repository';
import { QueryProdutoDto } from './dto/query-produto.dto';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(ProdutoRepository)
        private produtoRepository: ProdutoRepository,
        @InjectRepository(FotosRepository)
        private fotosRepository: FotosRepository
    ) {}
    
    async criarProduto(criarProdutoBodyDto: CriarProdutoBodyDto): Promise<Produto> {
        const { nome, descricao, fotos, preco } = criarProdutoBodyDto;
        const fotosArray: Foto[] = fotos.map((foto) => {
            return this.fotosRepository.criarFoto(foto);
        });
        const criarProdutoDto: CriarProdutoDto = {
            nome,
            descricao,
            preco,
            fotos: fotosArray
        }
        return await this.produtoRepository.criarProduto(criarProdutoDto);

    }

    async listarProdutos(queryProdutoDto: QueryProdutoDto): Promise<{ produtos: Produto[], total: number }> {
        return await this.produtoRepository.listarProdutos(queryProdutoDto);
    }

    async getProduto(id: number): Promise<Produto> {
        return this.produtoRepository.findOne(id);
    }

}
