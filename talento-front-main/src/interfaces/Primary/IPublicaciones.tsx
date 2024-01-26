export interface IPublicaciones {
  id_publi?: number;
  titulo_publi: string;
  autores_publi: string;
  filiacion_publi: string;
  lugar_publi: string;
  fecha_publi: Date | null;
  fecha_evento: Date | null;
  editorial_publi: string;
  isbn_publi: string;
  issn_publi: string;
  doi_publi: string;
  publicacion: string;
  persona: object | null;
}
