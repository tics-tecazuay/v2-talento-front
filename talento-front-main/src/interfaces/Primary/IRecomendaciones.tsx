export interface IRecomendaciones {
  id_recomendaciones?: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo: string;
  numeroContacto:string;
  persona: object | null;
}
