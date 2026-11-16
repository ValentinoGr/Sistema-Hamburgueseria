import { Module } from '@nestjs/common';
import { ZonasEnvioController } from './zonas-envio.controller.js';
import { ZonasEnvioService } from './zonas-envio.service.js';

@Module({
  controllers: [ZonasEnvioController],
  providers: [ZonasEnvioService],
})
export class ZonasEnvioModule{}
