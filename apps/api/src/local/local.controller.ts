// GET /api/local/estado (público). Después: editar configuración y horarios (ADMIN).
import { Controller,Get } from "@nestjs/common";
import { LocalService } from "./local.service.js";

@Controller('local')
export class LocalController{
    constructor(private readonly localService:LocalService){}

    @Get('estado')
    obtenerEstado(){
        return this.localService.obtenerEstado();
    }

    
}