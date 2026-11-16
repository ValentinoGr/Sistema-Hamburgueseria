import { Injectable } from '@nestjs/common';
import type { CartaCategoria } from '@hamburgueseria/shared';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CartaService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerCarta(): Promise<CartaCategoria[]> {
    const categorias = await this.prisma.categoria.findMany({
      where: { activa: true },
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        nombre: true,
        productos: {
          where: { activo: true },
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio: true,
            imagenUrl: true,
            disponible: true,
            esPersonalizable: true,
            tamanos: {
              orderBy: { tamano: { orden: 'asc' } },
              select: { tamano: { select: { id: true, nombre: true, precioAdicional: true } } },
            },
            extras: {
              where: { extra: { disponible: true } },
              orderBy: { extraId: 'asc' },
              select: { extra: { select: { id: true, nombre: true, precio: true } } },
            },
            ingredientes: {
              orderBy: { ingredienteId: 'asc' },
              select: { ingrediente: { select: { id: true, nombre: true } } },
            },
          },
        },
      },
    });

    return categorias
      .filter((categoria) => categoria.productos.length > 0)
      .map((categoria) => ({
        ...categoria,
        productos: categoria.productos.map(({ tamanos, extras, ingredientes, ...producto }) => ({
          ...producto,
          tamanos: producto.esPersonalizable ? tamanos.map((fila) => fila.tamano) : [],
          extras: producto.esPersonalizable ? extras.map((fila) => fila.extra) : [],
          ingredientes: producto.esPersonalizable ? ingredientes.map((fila) => fila.ingrediente) : [],
        })),
      }));
  }
}