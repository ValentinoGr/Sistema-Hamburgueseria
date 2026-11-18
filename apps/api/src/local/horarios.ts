import type {HorarioAtencion} from '@hamburgueseria/shared';
import type { MomentoLocal } from '../comun/hora-argentina.js';

export function aMinutos(hora:string) :number{
    const[horas,minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

export function estaEnHorario(horarios: HorarioAtencion[], ahora : MomentoLocal):boolean{
    return horarios.some((turno)=>{
        const abre = aMinutos(turno.abre); //9:00  540
        const cierra = aMinutos(turno.cierra); //13:00 780
        //hago pedido a las 10:30 630 minutos

        if (abre < cierra){
            return(
                ahora.diaSemana === turno.diaSemana &&
                ahora.minutos >= abre &&
                ahora.minutos < cierra
            );
        }

        const diaSiguiente = (turno.diaSemana + 1)%7;
        return(
            (ahora.diaSemana === turno.diaSemana && ahora.minutos >= abre) ||
            (ahora.diaSemana === diaSiguiente && ahora.minutos < cierra)
        )
    })
}