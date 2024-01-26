import axios from "axios";
import { AxiosInstance } from "axios/index";
import { environment } from "../environments/environment";

export class VistaPersonaService {
  baseUrl =  `${environment.baseUrl}api/fenix/cedula/`;

  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
    });
  }
  getByCedula(cedula: string) {
    return this.api
      .get(`${this.baseUrl}${cedula}`)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  getByCedulaSocio(id: number=0) {
    return this.api
        .get(`http://localhost:8081/talento/api/persona/${id}/cv_socioempleo`)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        });
  }
  getByMecanizado(id: number=0) {
    return this.api
        .get(`http://localhost:8081/talento/api/persona/${id}/mecanizado_iess`)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        });
  }
  getByDocumentosPersonales(id: number=0) {
    return this.api
        .get(`http://localhost:8081/talento/api/persona/${id}/documentos_personales`)
        .then((response) => response.data)
        .catch((error) => {
          throw error;
        });
  }
}
