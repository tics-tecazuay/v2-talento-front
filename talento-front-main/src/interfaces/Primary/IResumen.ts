import {IPersona} from "./IPersona";
import {ICapacitaciones} from "./ICapacitaciones";
import {ICargaFamiliar} from "./ICargaFamiliar";
import {IContratoData} from "./IContrato";
import {IEvaDocente} from "./IEva_Docente";
import {IHabilidadesData} from "./IHabilidades";
import {IHorarioData} from "./IHorario";
import {IRecomendaciones} from "./Recomendaciones";
import {InstruccionFormalData} from "./IInstrucc_Formal";
import {IExperiencia} from "./IExperiencia";
import { IPublicaciones } from "./IPublicaciones";

export interface IResumen {
    persona: IPersona,
    capacitaciones: ICapacitaciones[],
    cargaFamiliar: ICargaFamiliar[],
    contratos: IContratoData[],
    evaluaciones: IEvaDocente[],
    habilidades: IHabilidadesData[],
    horarios: IHorarioData[],
    publicaciones: IPublicaciones[],
    recomendaciones: IRecomendaciones[],
    instruccionFormals: InstruccionFormalData[],
    experiencias: IExperiencia[]
}
