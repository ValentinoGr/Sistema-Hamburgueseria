// Valida email y contraseña (bcrypt), arma el JWT según el rol y busca al usuario actual.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import type { RespuestaLogin } from '@hamburgueseria/shared';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PayloadJwt } from './payload-jwt.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<RespuestaLogin> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Si el usuario no existe, ni comparamos: la contraseña cuenta como incorrecta
    const passwordCorrecta = usuario
      ? await bcrypt.compare(password, usuario.passwordHash)
      : false;

    // Mismo mensaje para los tres casos: no le decimos a nadie qué emails existen
    if (!usuario || !passwordCorrecta || !usuario.activo) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const payload: PayloadJwt = { sub: usuario.id, rol: usuario.rol };
    const token = await this.jwt.signAsync(payload);

    return {
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    };
  }
}
