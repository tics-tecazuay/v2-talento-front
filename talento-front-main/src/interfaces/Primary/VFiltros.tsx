export interface IFiltros {
  id_persona?: number;
  apellido_paterno: string;
  primer_nombre: string;
  discapacidad: string;
  cedula?: string;
  genero: string;
  fecha_inicio: string;
  fecha_fin: string;
  contrato_vigente: boolean;
  salario_publico: string;
  salario?: number;
  tiempo_dedicacion: string;
}
