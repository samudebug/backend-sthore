import { EntityRepository, Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { QueryProdutoDto } from './dto/query-produto.dto';

@EntityRepository(Produto)
export class ProdutoRepository extends Repository<Produto> {
    async criarProduto(criarProdutoDto: CriarProdutoDto): Promise<Produto> {
        const { nome, descricao, fotos, preco } = criarProdutoDto;
        const produto = this.create();
        produto.nome = nome;
        produto.descricao = descricao;
        produto.preco = preco;
        produto.fotos = fotos;
        try {
            await produto.save();
            return produto;
        } catch(error) {
            throw new InternalServerErrorException('Erro ao salvar no banco');
        }
    }

    async listarProdutos(queryProdutoDto: QueryProdutoDto): Promise<{ produtos: Produto[], total: number }> {
        queryProdutoDto.page = queryProdutoDto.page < 1 || queryProdutoDto.page === undefined ? 1 : queryProdutoDto.page;
        queryProdutoDto.limit = queryProdutoDto.limit > 25 || queryProdutoDto.limit === undefined ? 25 : queryProdutoDto.limit;
        const query = this.createQueryBuilder('produto').leftJoinAndSelect('produto.fotos', 'foto');
        query.skip((queryProdutoDto.page - 1) * queryProdutoDto.limit);
        query.take(queryProdutoDto.limit);
        const [produtos, total] = await query.getManyAndCount();
        return { produtos, total }

    }
}