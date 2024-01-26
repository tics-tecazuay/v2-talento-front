import axios from "axios";
import { environment } from "../environments/environment";

export class EvaluacionService {
  //url base para el componente usuario, esta url se encuentra expresada
  //en la api
  baseUrl =  `${environment.baseUrl}api/evaluaciondocente/`;

  //Metodo para listar todas los horarios
  getAll() {
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }
  //Crear
  save(publicacion: any) {
    return axios
      .post(this.baseUrl + "create", publicacion)
      .then((res) => res.data);
  }

  getAllByEvaluacion(id: number) {
    return axios
      .get(`${this.baseUrl}readEvaluacion/${id}`)
      .then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return axios
      .get(`${this.baseUrl}readEvaluacionPersona/${id}`)
      .then((res) => res.data);
  }

  //(Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`).then((res) => res.data);
  }
  //Metodo para actualizar un horario basado en el id de la misma
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user)
      .then((res) => res.data);
  }

  getByEvidencia(id: number | undefined) {
    return axios
        .get(`${this.baseUrl}${id}/evidencia_evaluacion`)
        .then((res) => res.data);
  }
}
