import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProdutoModule } from './produto/produto.module';
import { FotosModule } from './fotos/fotos.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProdutoModule, FotosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
