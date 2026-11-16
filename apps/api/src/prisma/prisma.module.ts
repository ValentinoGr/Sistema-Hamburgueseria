import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// @Global: cualquier módulo puede usar PrismaService sin importar este módulo.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
