import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service';
import { ProdutoRepository } from './produto.repository';
import { FotosRepository } from '../fotos/fotos.repository';
import { CriarProdutoBodyDto } from './dto/criar-produto-body.dto';
import { QueryProdutoDto } from './dto/query-produto.dto';
import { NotFoundException } from '@nestjs/common';



const mockProdutoRepository = () => ({
  criarProduto: jest.fn(),
  listarProdutos: jest.fn(),
  findOne: jest.fn()
});

const mockFotoRepository = () => ({
  criarFoto: jest.fn(),
});

describe('ProdutoService', () => {
  let produtoRepository;
  let fotoRepository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutoService,{
        provide: ProdutoRepository,
        useFactory: mockProdutoRepository
      },{
        provide: FotosRepository,
        useFactory: mockFotoRepository
      }],
    }).compile();

    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
    fotoRepository = module.get<FotosRepository>(FotosRepository);
    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(produtoRepository).toBeDefined();
    expect(fotoRepository).toBeDefined();
  });

  describe('criarProduto', () => {
    let criarProdutoBodyDto: CriarProdutoBodyDto;

    beforeEach(() => {
      criarProdutoBodyDto = {
        descricao: 'mockDescr',
        nome: 'mockNome',
        preco: 22,
        fotos: ['mockLink',]
      };
    });

    it('should create a produto', async () => {
      produtoRepository.criarProduto.mockResolvedValue('mockProduto');
      fotoRepository.criarFoto.mockReturnValue({linkFoto: 'mockLink'});
      const result = await service.criarProduto(criarProdutoBodyDto);

      expect(fotoRepository.criarFoto).toBeCalledWith('mockLink');
      expect(produtoRepository.criarProduto).toBeCalledWith({
        descricao: 'mockDescr',
        nome: 'mockNome',
        preco: 22,
        fotos: [{linkFoto: 'mockLink'}]
      });
      expect(result).toEqual('mockProduto');
    });
  });

  describe('listarProdutos', () => {
    it('should call the listarProdutos of the ProdutosRepository', async () => {
      produtoRepository.listarProdutos.mockResolvedValue('mockList');
      const mockQueryProdutoDto: QueryProdutoDto = {
        limit: 25,
        page: 1
      };
      const result = await service.listarProdutos(mockQueryProdutoDto);
      expect(produtoRepository.listarProdutos).toBeCalledWith(mockQueryProdutoDto);
      expect(result).toEqual('mockList');
      
    });
  });

  describe('getProduto', () => {
    it('should return the found Produto', async () => {
      produtoRepository.findOne.mockResolvedValue('mockProduto');
      expect(produtoRepository.findOne).not.toHaveBeenCalled();

      const result = await service.getProduto(0);
      expect(produtoRepository.findOne).toHaveBeenCalledWith(0);
      expect(result).toEqual('mockProduto');
    });

    it('should throw an error if a Produto is not found', async () => {
      produtoRepository.findOne.mockResolvedValue(null);
      expect(service.getProduto(0)).rejects.toThrow(NotFoundException);
    });
  });
});
