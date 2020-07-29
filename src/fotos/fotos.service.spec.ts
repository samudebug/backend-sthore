import { Test, TestingModule } from '@nestjs/testing';
import { FotosService } from './fotos.service';
import { FotosRepository } from './fotos.repository';

const mockFotoRepository = () => ({
  criarFoto: jest.fn(),
})

describe('FotosService', () => {
  let service: FotosService;
  let fotosRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FotosService, {
        provide: FotosRepository,
        useFactory: mockFotoRepository
      }],
    }).compile();

    service = module.get<FotosService>(FotosService);
    fotosRepository = module.get<FotosRepository>(FotosRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(fotosRepository).toBeDefined();
  });

  describe('criarFoto', () => {
    it('should create a Foto', async () => {
      fotosRepository.criarFoto.mockResolvedValue({linkFoto: 'mockLink'});
      const result = await service.criarFoto('mockLink');
      expect(fotosRepository.criarFoto).toBeCalledWith('mockLink');
      expect(result).toEqual({linkFoto: 'mockLink'});
    });
  });
});
