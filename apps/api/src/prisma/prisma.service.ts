import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// Cliente de Prisma como servicio de Nest: se crea una sola vez y lo comparte toda la API.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
    });
    super({ adapter });
  }

  // Al arrancar la API: abre la conexión (si falla, la API no levanta)
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado a la base de datos');
  }

  // Al apagar la API: cierra la conexión prolijamente
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
