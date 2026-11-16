// Consulta categorías activas con sus productos y personalizaciones, con la forma del contrato.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CartaService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerCarta() {
    const categorias = await this.prisma.categoria.findMany({
      where: { activa: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        nombre: true,
      },
    });
    return categorias;
  }
}
