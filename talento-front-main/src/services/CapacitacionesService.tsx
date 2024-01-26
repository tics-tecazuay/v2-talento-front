import axios, { AxiosInstance } from "axios";
import { ICapacitaciones } from "../interfaces/Primary/ICapacitaciones";
import { environment } from "../environments/environment";

const API_BASE_URL = `${environment.baseUrl}api/capacitaciones`;

export class CapacitacionesService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  getAllCap() {
    //Método para listar todas los Usuarios
    return this.api.get("/read").then((res) => res.data);
  }

  guardarCapacitaciones(capacitaciones: ICapacitaciones) {
    return this.api
      .post("/create", capacitaciones)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }

  getAllByCapacitaciones(id: number) {
    return this.api.get(`readCapacitaciones/${id}`).then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return this.api
      .get(`readCapacitacionPersona/${id}`)
      .then((res) => res.data);
  }

  updateCapacitaciones(id: number, capacitaciones: ICapacitaciones) {
    return this.api
      .put(`/update/${id}`, capacitaciones)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }

  deleteCapacitaciones(id: number) {
    return this.api.delete(`/delete/${id}`).then((res) => res.data);
  }

  getByCapacitaciones(id: number | null | undefined) {
    return this.api
        .get(`${id}/evidencia`)
        .then((res) => res.data);
  }
}
