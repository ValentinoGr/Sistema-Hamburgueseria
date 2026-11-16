import { Module } from '@nestjs/common';
import { CartaController } from './carta.controller.js';
import { CartaService } from './carta.service.js';

@Module({
  controllers: [CartaController],
  providers: [CartaService],
})
export class CartaModule {}
