import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FotosRepository } from './fotos.repository';
import { Foto } from './foto.entity';

@Injectable()
export class FotosService {

    constructor(
        @InjectRepository(FotosRepository)
        private fotosRepository: FotosRepository,
    ) {}

    criarFoto(linkFoto: string): Foto {
        return this.fotosRepository.criarFoto(linkFoto);
    }
}
