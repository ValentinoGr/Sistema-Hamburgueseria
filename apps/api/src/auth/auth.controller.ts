// POST /api/auth/login y GET /api/auth/yo.
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login: devuelve el token y los datos del usuario
  @Post('login')
  @HttpCode(200)
  login(@Body() datos: LoginDto) {
    return this.authService.login(datos.email, datos.password);
  }
}
