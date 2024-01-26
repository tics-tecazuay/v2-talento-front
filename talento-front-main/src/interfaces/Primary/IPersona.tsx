export interface IPersona {
  id_persona?: number;
  cedula: string;
  apellido_paterno: string;
  apellido_materno: string;
  primer_nombre: string;
  segundo_nombre: string;
  fecha_nacimiento: Date | null;
  pais_natal: string;
  genero: string;
  sexo: string;
  tipo_sangre: string;
  estado_civil: string;
  etnia: string;
  idioma_raiz: string;
  idioma_secundario: string;
  foto: string;
  cv_socioempleo: string | null;
  mecanizado_iess: string | null;
  documentos_personales: string | null;
  descripcion_perfil: string;


  pais_residencia: string;
  provincia_residencia: string;
  canton_residencia: string;
  parroquia_residencia: string;
  calles: string;
  numero_casa: string;
  sector: string;
  referencia: string;

  celular: string;
  telefono: string;
  correo: string;
  correo_institucional: string;

  discapacidad: string;
  tipo_discapacidad: string;
  porcentaje_discapacidad: string;
  carnet_conadis: string;
  foto_carnet: string | null;
}
