import {
  BadRequestException,
  ValidationPipe,
  type ValidationError,
} from '@nestjs/common';

export type ErrorDeCampo = { campo: string; mensaje: string };

// class-validator devuelve los errores como un árbol (items -> 0 -> cantidad).
// Esta función lo aplana a una lista: "items.0.cantidad".
function aplanarErrores(
  errores: ValidationError[],
  prefijo = '',
): ErrorDeCampo[] {
  return errores.flatMap((error) => {
    const campo = prefijo ? `${prefijo}.${error.property}` : error.property;
    const propios = Object.values(error.constraints ?? {}).map((mensaje) => ({
      campo,
      mensaje,
    }));
    const hijos = aplanarErrores(error.children ?? [], campo);
    return [...propios, ...hijos];
  });
}

// Pipe global: valida todos los bodies, params y query strings contra su DTO.
export function crearValidationPipe() {
  return new ValidationPipe({
    whitelist: true, // borra los campos que no están en el DTO
    forbidNonWhitelisted: true, // ...y si mandan campos de más, responde 400
    transform: true, // convierte el JSON en una instancia del DTO
    exceptionFactory: (errores) =>
      new BadRequestException({
        statusCode: 400,
        message: 'Datos inválidos',
        errors: aplanarErrores(errores),
      }),
  });
}
