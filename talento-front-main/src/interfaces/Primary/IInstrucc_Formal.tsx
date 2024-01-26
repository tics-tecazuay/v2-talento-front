export interface InstruccionFormalData {
  id_instruccion?: Number;
  nivelInstruccion: string;
  institucionEducativa: string;
  tituloObtenido: string;
  num_SenecytRegistro: string;
  tiempoEstudio: number | null;
  anioGraduacion: number | null;
  areaEstudios: string;
  titulo: string;
  persona: object | null;
}
