import type { Rol } from "@hamburgueseria/shared";

export interface PayloadJwt{
    sub: number;
    rol: Rol;
}