import { TestingModule, Test } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { CriarProdutoBodyDto } from './dto/criar-produto-body.dto';
import { QueryProdutoDto } from './dto/query-produto.dto';
import { NotFoundException } from '@nestjs/common';

const mockProdutoService = () => ({
    criarProduto: jest.fn(),
    listarProdutos: jest.fn(),
    getProduto: jest.fn()
});

describe('ProdutoController', () => {
    let controller;
    let produtoService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProdutoController],
            providers: [{
                provide: ProdutoService,
                useFactory: mockProdutoService
            }]
        }).compile();
        controller = module.get<ProdutoController>(ProdutoController);
        produtoService = module.get<ProdutoService>(ProdutoService);

    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(produtoService).toBeDefined();
    });

    describe('criarProduto', () => {
        it('should create a Produto', async () => {
            const criarProdutoBodyDto: CriarProdutoBodyDto = {
                nome: 'mockNome',
                descricao: 'mockDescricao',
                preco: 22,
                fotos: ['mockLink']
            }
            produtoService.criarProduto.mockResolvedValue('mockProduto');
            const result = await controller.criarProduto(criarProdutoBodyDto);
            expect(produtoService.criarProduto).toBeCalledWith(criarProdutoBodyDto);
            expect(result).toEqual('mockProduto');
        });
    });

    describe('listarProdutos', () => {
        it('should list Produtos', async () => {
            produtoService.listarProdutos.mockResolvedValue(['mockItem']);
            const mockQueryProdutoDto: QueryProdutoDto = {
                limit: 25,
                page: 1
              };
            const result = await controller.listarProduto(mockQueryProdutoDto);
            expect(produtoService.listarProdutos).toBeCalledWith(mockQueryProdutoDto);
            expect(result).toEqual(['mockItem']);
        });
    });

    describe('getProduto', () => {
        it('should return the found Produto', async () => {
            produtoService.getProduto.mockResolvedValue('mockProduto');
            const result = await controller.getProduto(0);
            expect(produtoService.getProduto).toBeCalledWith(0);
            expect(result).toEqual('mockProduto');
        });

        it('should return an error if a Produto is not found', async () => {
            try {
                produtoService.getProduto.mockImplementation(() => {
                    throw new NotFoundException('Produto não encontrado');
                });
            } catch(error) {
                const result = await controller.getProduto(0);
                expect(produtoService.getProduto).toBeCalledWith(0);
                expect(produtoService.getProduto).rejects.toThrow(NotFoundException);
                expect(result).toEqual({message: 'Produto não encontrado'});
            }
            
            
        })
    });
});