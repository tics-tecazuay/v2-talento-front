export interface IContratoData {
  id_contrato?: Number;
  fecha_inicio?: Date| null;
  fecha_fin?: Date| null;
  anio_duracion: string;
  horas_diarias: string;
  cargo: string;
  salario: string;
  evidencia: string | null;
  tiempo_dedicacion: string;
  salario_publico: string;
  contrato_vigente: boolean;
  persona: object | null;
}
