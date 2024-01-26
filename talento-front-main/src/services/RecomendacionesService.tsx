import axios from "axios";
import { environment } from "../environments/environment";

export class RecomendacionesService {
  //url base para el componente usuario, esta url se encuentra expresada
  //en la api
  baseUrl =  `${environment.baseUrl}api/recomendaciones/`;

  getAll() {
    //Método para listar todas los Usuarios
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }
  save(recomendacion: any) {
    // Método para guardar la instrucción
    return axios
      .post(this.baseUrl + "create", recomendacion)
      .then((res) => res.data);
  }
  getAllByRecomendacion(id: number) {
    return axios
      .get(`${this.baseUrl}readRecomendaciones/${id}`)
      .then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return axios
      .get(`${this.baseUrl}readRecomendacionesPersona/${id}`)
      .then((res) => res.data);
  }
  //Método para cambiar el estado enabled a false de un Usuario (Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`).then((res) => res.data);
  }
  //Método para actualizar un usuario basado en el id del mismo
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user)
      .then((res) => res.data);
  }
}
