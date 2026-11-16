import { ZonasEnvioService } from "./zonas-envio.service.js";
import { Controller,Get } from "@nestjs/common";

@Controller('zonas-envio')
export class ZonasEnvioController{
    constructor(private readonly zonasEnvioService:ZonasEnvioService){}

    @Get()
    listar(){
        return this.zonasEnvioService.listarActivas();
    }
}
