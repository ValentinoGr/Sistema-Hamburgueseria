export interface HorarioAtencion{
    diaSemana: number;
    abre: string;
    cierra: string;
}

export interface EstadoLocal{
    nombreLocal: string;
    telefono:string | null;
    aliasTransferencia: string | null;
    cbu:string | null;
    abierto: boolean;
    enHorario:boolean;
    horarios:HorarioAtencion[];
    pedidosPausados: boolean;
}