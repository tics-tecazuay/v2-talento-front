import axios from "axios";
import { environment } from "../environments/environment";

export class PublicacionesService {
  baseUrl =  `${environment.baseUrl}api/publicaciones/`;

  //Metodo para listar todas los horarios
  getAll() {
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }

  getAllByPublicacion(id: number) {
    return axios
      .get(`${this.baseUrl}readPublicaciones/${id}`)
      .then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return axios
      .get(`${this.baseUrl}readPublicacionesPersona/${id}`)
      .then((res) => res.data);
  }
  //Crear
  save(publicacion: any) {
    return axios
      .post(this.baseUrl + "create", publicacion)
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

  getByPublicacion(id: number | undefined) {
    return axios
        .get(`${this.baseUrl}${id}/publicacion`)
        .then((res) => res.data);
  }
}
