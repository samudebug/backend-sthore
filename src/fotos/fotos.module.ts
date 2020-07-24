import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotosRepository } from './fotos.repository';
import { FotosService } from './fotos.service';

@Module({
    imports: [TypeOrmModule.forFeature([FotosRepository])],
    providers: [FotosService]
})
export class FotosModule {}
