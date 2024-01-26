export interface IEvaDocente {
  id_evaluacion?: number;
  evidencia_evaluacion: string;
  cod_carrera: string;
  per_nombre: string;
  persona: object | null;
}
