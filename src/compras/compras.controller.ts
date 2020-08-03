import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CompraBodyDto } from './dto/compra-body.dto';
import { ComprasService } from './compras.service';
import { Compra } from './compra.entity';

@Controller('compras')
export class ComprasController {

    constructor(private comprasService: ComprasService) {}

    @Post()
    async salvarCompra(@Body() compraBodyDto: CompraBodyDto): Promise<{message: string, code: string}> {
        return this.comprasService.realizarCompra(compraBodyDto);
    }

    @Get(':orderId')
    async consultarCompra(@Param('orderId') orderId:string): Promise<{valor: number, status: string}> {
        return this.comprasService.getCompra(orderId);
    }
}
