// Calcula si el local está abierto (horarios + hora de Argentina) y lee/edita la configuración.
import { Injectable,InternalServerErrorException } from "@nestjs/common";
import type { EstadoLocal } from "@hamburgueseria/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { momentoEnArgentina } from "../comun/hora-argentina.js";
import { estaEnHorario } from "./horarios.js";

@Injectable()
export class LocalService{
    constructor (private readonly prisma : PrismaService){}

    async obtenerEstado() : Promise<EstadoLocal>{
        const config = await this.prisma.configuracionLocal.findUnique({
            where: {id:1},
            include: {
                horarios:{orderBy: [{diaSemana: 'asc'},{abre: 'asc'}]},
            },
        });

        if(!config){
        throw new InternalServerErrorException(
            'Falta la configuracion del local. Correr seed'
        );
    }
        const horarios = config.horarios.map(({diaSemana,abre,cierra})=>({
            diaSemana,
            abre,
            cierra,
        }));
        const enHorario = estaEnHorario(horarios, momentoEnArgentina());

        return{
                nombreLocal: config.nombreLocal,
                telefono: config.telefono,
                abierto: enHorario && !config.pedidosPausados,
                enHorario,
                pedidosPausados: config.pedidosPausados,
                horarios,
                aliasTransferencia: config.aliasTransferencia,
                cbu: config.cbu,
        };

    }
}