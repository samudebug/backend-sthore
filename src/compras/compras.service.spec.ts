import { Test, TestingModule } from '@nestjs/testing';
import { ComprasService } from './compras.service';
import { ComprasRepository } from './compras.repository';
import { ProdutoRepository } from '../produto/produto.repository';

import { Cielo, EnumBrands, EnumCardType } from 'cielo';
import { CompraBodyDto } from './dto/compra-body.dto';
import { NotFoundException } from '@nestjs/common';
jest.genMockFromModule('cielo');
jest.mock('cielo')

const mockCieloObj = {
  creditCard: {
    transaction: jest.fn(),
    captureSaleTransaction: jest.fn(),
  },
  consult: {
    paymentId: jest.fn()
  }
};

(Cielo as jest.Mock).mockImplementation(() => mockCieloObj);

const mockCompraRepository = () => ({
  salvarCompra: jest.fn(),
  findOne: jest.fn()
});

const mockProdutoRepository = () => ({
  findOne: jest.fn()
});

describe('ComprasService', () => {
  let service: ComprasService;
  let compraRepository;
  let produtoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComprasService, {
        provide: ComprasRepository,
        useFactory: mockCompraRepository
      }, {
        provide: ProdutoRepository,
        useFactory: mockProdutoRepository
      }],
    }).compile();

    service = module.get<ComprasService>(ComprasService);
    compraRepository = module.get<ComprasRepository>(ComprasRepository);
    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(produtoRepository).toBeDefined();
    expect(compraRepository).toBeDefined();
    expect(Cielo).toBeCalledTimes(1)
  });

  describe('realizarCompra', () => {
    let mockCompraBodyDto: CompraBodyDto;

    beforeEach(() => {
      mockCompraBodyDto = {
        cliente: {
          nome: "mockNome",
          telefone: "mockTelefone",
          email: "mockEmail",
          endereco: "mockEndereço"
        },
        pagamento: {
          bandeira: "master",
          numero: "mockNumero",
          validade: "mockValidade",
          cvv:"mockCvv",
          titular: "mockTitular"
        },
        produtos: [2],
        valorTotal: 23.57
      };
    })

    it('should make order sucessfully', async () => {

      produtoRepository.findOne.mockResolvedValue('mockProduto');
      mockCieloObj.creditCard.transaction.mockResolvedValue({payment: {paymentId: 'mockPaymentId'}})
      mockCieloObj.creditCard.captureSaleTransaction.mockResolvedValue({status: 2});
      compraRepository.salvarCompra.mockResolvedValue('mockCompra');
      const result = await service.realizarCompra(mockCompraBodyDto);
      expect(produtoRepository.findOne).toBeCalledWith(mockCompraBodyDto.produtos[0]);
      expect(mockCieloObj.creditCard.transaction).toBeCalledWith({
        customer: {
          name: mockCompraBodyDto.cliente.nome
        },
        merchantOrderId: expect.any(String),
        payment: {
          amount: mockCompraBodyDto.valorTotal * 100,
          creditCard: {
            brand: EnumBrands.MASTER,
            cardNumber: mockCompraBodyDto.pagamento.numero,
            holder: mockCompraBodyDto.pagamento.titular,
            expirationDate: mockCompraBodyDto.pagamento.validade,
            securityCode: mockCompraBodyDto.pagamento.cvv,
          },
          installments: 1,
          softDescriptor: 'Sthore',
          type: EnumCardType.CREDIT,
        }
      });
      expect(compraRepository.salvarCompra).toBeCalledWith({
        paymentId: 'mockPaymentId',
        produtos: ['mockProduto'],
        nomeCliente: mockCompraBodyDto.cliente.nome,
        enderecoCliente: mockCompraBodyDto.cliente.endereco,
        emailCliente: mockCompraBodyDto.cliente.email,
        compraCode: expect.any(String)
      });
      expect(mockCieloObj.creditCard.captureSaleTransaction).toBeCalledWith({paymentId: 'mockPaymentId'});
      expect(result).toEqual({
        message: 'Operação realizada com sucesso', code: expect.any(String)
      })

    });

    it('should throw error with invalid product', async () => {
      produtoRepository.findOne.mockResolvedValue(null);
      expect(service.realizarCompra(mockCompraBodyDto)).rejects.toThrow();
      expect(produtoRepository.findOne).toBeCalledWith(mockCompraBodyDto.produtos[0]);
    });

    it('should throw error with invalid credit card info', async () => {
      mockCieloObj.creditCard.transaction.mockRejectedValue(null);
      expect(service.realizarCompra(mockCompraBodyDto)).rejects.toBeNull();
    });

  });

  describe('getCompra', () => {
    it('should read the order successfully with finished status', async () => {
      compraRepository.findOne.mockResolvedValue({paymentId: 'mockPaymentId'});
      mockCieloObj.consult.paymentId.mockResolvedValue({payment: {status: 2, amount: 100}});
      const result = await service.getCompra('mockOrderId');
      expect(compraRepository.findOne).toBeCalledWith({where: {orderCode: 'mockOrderId'}});
      expect(mockCieloObj.consult.paymentId).toBeCalledWith({paymentId: 'mockPaymentId'});
      expect(result).toEqual({valor: 1, status: 'Finalizada'});
    });

    it('should read the order successfully with confirmed status', async () => {
      compraRepository.findOne.mockResolvedValue({paymentId: 'mockPaymentId'});
      mockCieloObj.consult.paymentId.mockResolvedValue({payment: {status: 1, amount: 100}});
      const result = await service.getCompra('mockOrderId');
      expect(compraRepository.findOne).toBeCalledWith({where: {orderCode: 'mockOrderId'}});
      expect(mockCieloObj.consult.paymentId).toBeCalledWith({paymentId: 'mockPaymentId'});
      expect(result).toEqual({valor: 1, status: 'Confirmada'});
    });
    it('should read the order successfully with waiting status', async () => {
      compraRepository.findOne.mockResolvedValue({paymentId: 'mockPaymentId'});
      mockCieloObj.consult.paymentId.mockResolvedValue({payment: {status: 0, amount: 100}});
      const result = await service.getCompra('mockOrderId');
      expect(compraRepository.findOne).toBeCalledWith({where: {orderCode: 'mockOrderId'}});
      expect(mockCieloObj.consult.paymentId).toBeCalledWith({paymentId: 'mockPaymentId'});
      expect(result).toEqual({valor: 1, status: 'Aguardando'});
    });

    it('should throw an error with invalid code', async () => {
      compraRepository.findOne.mockResolvedValue(null);
      expect(service.getCompra('mockOrderId')).rejects.toThrow(NotFoundException);
    });

    it('should return an error with invalid paymentId', async () => {
      compraRepository.findOne.mockResolvedValue({paymentId: 'mockPaymentId'});
      mockCieloObj.consult.paymentId.mockRejectedValue(null);
      expect(service.getCompra('mockOrderId')).rejects.toBeNull();
    });
  })
});
