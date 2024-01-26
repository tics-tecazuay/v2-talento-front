export interface IHorarioData {
  id_horario?: Number;
  periodoAcademico: string;
  jornadaHorario: string;
  horasSemanalesHorario: string;
  carreraHorario: string;
  distributivo: string;
  persona: object | null;
}
