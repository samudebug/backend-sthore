import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasRepository } from './compras.repository';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { ProdutoRepository } from 'src/produto/produto.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ComprasRepository, ProdutoRepository])],
    providers: [ComprasService],
    controllers: [ComprasController],
})
export class ComprasModule {}
