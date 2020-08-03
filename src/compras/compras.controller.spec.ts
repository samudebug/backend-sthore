import { Test, TestingModule } from '@nestjs/testing';
import { ComprasController } from './compras.controller';
import { CompraBodyDto } from './dto/compra-body.dto';
import { ComprasService } from './compras.service';
import { NotFoundException } from '@nestjs/common';

const mockComprasService = () => ({
  realizarCompra: jest.fn(),
  getCompra: jest.fn()
})

describe('Compras Controller', () => {
  let controller: ComprasController;
  let comprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprasController],
      providers: [{
        provide: ComprasService,
        useFactory: mockComprasService
      }]
    }).compile();

    controller = module.get<ComprasController>(ComprasController);
    comprasService = module.get<ComprasService>(ComprasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(comprasService).toBeDefined();
  });

  describe('salvarCompra', () => {
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

    it('should save order successfully', async () => {
      comprasService.realizarCompra.mockResolvedValue('mockResult');
      const result = await controller.salvarCompra(mockCompraBodyDto);
      expect(comprasService.realizarCompra).toBeCalledWith(mockCompraBodyDto);
      expect(result).toEqual('mockResult');
    });

    it('should throw an error with invalid product', async () => {
      try {
        comprasService.realizarCompra.mockImplementation(() => {
          throw new NotFoundException('Produto inválido!');
        });
      } catch(error) {
        const result = await controller.salvarCompra(mockCompraBodyDto);
        expect(comprasService.realizarCompra).toBeCalledWith(mockCompraBodyDto);
        expect(comprasService.realizarCompra).rejects.toThrow(NotFoundException);
        expect(result).toEqual({message: 'Produto inválido!'});
      }
    });

    it('should reject with invalid credit card info', async () => {
      comprasService.realizarCompra.mockRejectedValue(null);
      
      expect(controller.salvarCompra(mockCompraBodyDto)).rejects.toBeNull();
      expect(comprasService.realizarCompra).toBeCalledWith(mockCompraBodyDto);
    });
  });

  describe('getCompra', () => {
    it('should get order successfully with finished status', async () => {
      comprasService.getCompra.mockResolvedValue({valor: 1, status: 'Finalizada'});
      const result = await controller.consultarCompra('mockOrderId');
      expect(comprasService.getCompra).toBeCalledWith('mockOrderId');
      expect(result).toEqual({valor: 1, status: 'Finalizada'});
    });

    it('should get order successfully with confirmed status', async () => {
      comprasService.getCompra.mockResolvedValue({valor: 1, status: 'Confirmada'});
      const result = await controller.consultarCompra('mockOrderId');
      expect(comprasService.getCompra).toBeCalledWith('mockOrderId');
      expect(result).toEqual({valor: 1, status: 'Confirmada'});
    });

    it('should get order successfully with awaiting status', async () => {
      comprasService.getCompra.mockResolvedValue({valor: 1, status: 'Aguardando'});
      const result = await controller.consultarCompra('mockOrderId');
      expect(comprasService.getCompra).toBeCalledWith('mockOrderId');
      expect(result).toEqual({valor: 1, status: 'Aguardando'});
    });

    it('should return an error with invalid orderId', async () => {
      try {
        comprasService.getCompra.mockImplementation(() => {
          throw new NotFoundException('Compra não encontrada!');
        });
      }catch(err) {
        const result = await controller.consultarCompra('mockOrderId');
        expect(comprasService.getCompra).toBeCalledWith('mockOrderId');
        expect(comprasService.getCompra).rejects.toThrow(NotFoundException);
        expect(result).toEqual({message: 'Compra não encontrada!'});
      }
    });


  })
});
