import { Controller, Get } from '@nestjs/common';
import { CartaService } from './carta.service.js';

@Controller('carta')
export class CartaController {
  constructor(private readonly cartaService: CartaService) {}

  @Get()
  obtenerCarta() {
    return this.cartaService.obtenerCarta();
  }
}
