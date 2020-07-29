import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoRepository } from './produto.repository';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { FotosRepository } from '../fotos/fotos.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ProdutoRepository, FotosRepository])],
    providers: [ProdutoService],
    controllers: [ProdutoController]
})
export class ProdutoModule {}
