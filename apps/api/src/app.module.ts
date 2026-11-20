import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { CartaModule } from './carta/carta.module.js';
import { ZonasEnvioModule } from './zonas-envio/zonas-envio.module.js';
import { LocalModule } from './local/local.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CartaModule,
    ZonasEnvioModule,
    LocalModule,
    
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
