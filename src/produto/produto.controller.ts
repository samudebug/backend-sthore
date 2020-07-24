import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CriarProdutoBodyDto } from './dto/criar-produto-body.dto';
import { Produto } from './produto.entity';
import { QueryProdutoDto } from './dto/query-produto.dto';

@Controller('produto')
export class ProdutoController {
    constructor(private produtoService: ProdutoService) {}

    @Post()
    async criarProduto(
        @Body() criarProdutoBodyDto: CriarProdutoBodyDto
    ): Promise<Produto> {
        return this.produtoService.criarProduto(criarProdutoBodyDto);
    }

    @Get()
    async listarProduto(
        @Query() query: QueryProdutoDto
    ): Promise<{ produtos: Produto[], total: number }> {
        return this.produtoService.listarProdutos(query);
    }

    @Get(':id')
    async getProduto(
        @Param('id') id:number
    ): Promise<Produto> {
        return this.produtoService.getProduto(id);
    }

}
