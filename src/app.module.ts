import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmModuleOptions } from './config/typeorm.config';
import { ProdutoModule } from './produto/produto.module';
import { FotosModule } from './fotos/fotos.module';

const environment = process.env.NODE_ENV;

const typeOrmConfig = getTypeOrmModuleOptions(environment);

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProdutoModule, FotosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
