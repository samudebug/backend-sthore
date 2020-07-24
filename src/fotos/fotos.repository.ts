import { Repository, EntityRepository } from 'typeorm';
import { Foto } from './foto.entity';

@EntityRepository(Foto)
export class FotosRepository extends Repository<Foto> {
    criarFoto(linkFoto: string): Foto {
        const foto = this.create();
        foto.linkFoto = linkFoto;
        return foto;
    }
}