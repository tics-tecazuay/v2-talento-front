import axios from "axios";
import { environment } from "../environments/environment";

export class HabilidadesService {
  baseUrl =  `${environment.baseUrl}api/habilidades/`;

  //Metodo para listar todas las habilidades
  getAll() {
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }
  //Crear
  save(habilidades: any) {
    return axios
      .post(this.baseUrl + "create", habilidades)
      .then((res) => res.data);
  }
  getAllByHabilidades(id: number) {
    return axios
      .get(`${this.baseUrl}readHabilidades/${id}`)
      .then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return axios
      .get(`${this.baseUrl}readHabilidadesPersona/${id}`)
      .then((res) => res.data);
  }
  //(Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`).then((res) => res.data);
  }
  //Metodo para actualizar una habilidad basado en el id de la misma
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user)
      .then((res) => res.data);
  }
}
