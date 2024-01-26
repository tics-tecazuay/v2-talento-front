export interface IExperiencia {
    id_experiencia?: number;
    institucion: string;
    puesto: string;
    area_trabajo: string;
    fecha_inicio: Date| null;
    fecha_fin: Date| null;
    actividades: string;
    estado: boolean;
    certificado_trabajo: string | null;
    persona: object | null;
}
