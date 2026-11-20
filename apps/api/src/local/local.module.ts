// Módulo del local: estado, configuración y horarios.
import { Module } from '@nestjs/common';
import { LocalController } from './local.controller.js';
import { LocalService } from './local.service.js';

@Module({
  controllers: [LocalController],
  providers: [LocalService],
  exports: [LocalService],
})
export class LocalModule {}