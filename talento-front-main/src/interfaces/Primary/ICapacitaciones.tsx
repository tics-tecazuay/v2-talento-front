export interface ICapacitaciones {
  id_capacitaciones?: number | null;
  institucion: string;
  tipo_evento: string;
  nombre_evento: string;
  area_estudios: string;
  tipo_certificado: string;
  fecha_inicio: Date | null;
  fecha_fin: Date | null;
  numero_dias: number | null;
  cantidad_horas: number | null;
  evidencia: string;
  persona: object | null;
}
