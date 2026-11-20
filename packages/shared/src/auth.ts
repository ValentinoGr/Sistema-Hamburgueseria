import type {Rol} from './enums.js';

export interface UsuarioSesion{
    id: number;
    nombre: string;
    rol:Rol;
}

export interface RespuestaLogin{
    token: string;
    usuario: UsuarioSesion
}