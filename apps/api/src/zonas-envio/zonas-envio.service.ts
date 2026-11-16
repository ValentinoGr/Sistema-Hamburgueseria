import { Injectable } from "@nestjs/common";
import type {ZonaEnvio} from '@hamburgueseria/shared';
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class ZonasEnvioService{
    constructor(private readonly prisma:PrismaService){}


    listarActivas(): Promise<ZonaEnvio[]>{
        return this.prisma.zonaEnvio.findMany({
            where:{activa: true},
            orderBy:{costo:'asc'},
            select:{id:true, nombre:true, costo:true}
        })
    }
}