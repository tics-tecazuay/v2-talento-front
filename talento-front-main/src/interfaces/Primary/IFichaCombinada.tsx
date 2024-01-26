import { IPersona } from '../../interfaces/Primary/IPersona';
import { ICapacitaciones } from '../../interfaces/Primary/ICapacitaciones';
import { ICargaFamiliar } from '../../interfaces/Primary/ICargaFamiliar';
import { IContratoData } from '../../interfaces/Primary/IContrato';
import { IEvaDocente } from '../../interfaces/Primary/IEva_Docente';
import { IHabilidadesData } from '../../interfaces/Primary/IHabilidades';
import { IHorarioData } from '../../interfaces/Primary/IHorario';
import { InstruccionFormalData } from '../../interfaces/Primary/IInstrucc_Formal';
import { IRecomendaciones } from '../../interfaces/Primary/Recomendaciones';
import { IExperiencia } from '../../interfaces/Primary/IExperiencia';

export interface FichaCombinada {

    persona: IPersona;
    capacitaciones: ICapacitaciones[];
    cargaFamiliar: ICargaFamiliar[];
    contratos: IContratoData[];
    evaluaciones: IEvaDocente[];
    habilidades: IHabilidadesData[];
    horarios: IHorarioData[];
    recomendaciones: IRecomendaciones[];
    instruccion: InstruccionFormalData[];
    experiencias: IExperiencia[];
}
