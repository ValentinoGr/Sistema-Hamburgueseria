import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { crearValidationPipe } from './comun/validacion.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // todas las rutas empiezan con /api
  app.enableCors({ origin: 'http://localhost:5173' }); // el front en desarrollo (Vite)
  app.useGlobalPipes(crearValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
