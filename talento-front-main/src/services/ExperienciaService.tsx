import axios, { AxiosInstance } from "axios";
import { IExperiencia } from "../interfaces/Primary/IExperiencia";
import { environment } from "../environments/environment";

const API_BASE_URL =  `${environment.baseUrl}api/experiencia`;

export class ExperienciaService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  getAllItems() {
    return this.api
      .get("/read")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  getAllByExperiencia(id: number) {
    return this.api.get(`readExperiencia/${id}`).then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return this.api.get(`readExperienciaPersona/${id}`).then((res) => res.data);
  }

  createItem(item: IExperiencia) {
    return this.api
      .post("/create", item)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  updateItem(itemId: number, item: IExperiencia) {
    return this.api
      .put(`/update/${itemId}`, item)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  deleteItem(itemId: number) {
    return this.api
      .delete(`/delete/${itemId}`)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  getByEvidencia(id: number | undefined) {
    return this.api.get(`${id}/certificado_trabajo`).then((res) => res.data);
  }
}
