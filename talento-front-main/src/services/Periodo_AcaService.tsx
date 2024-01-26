import axios from "axios";
import { environment } from "../environments/environment";

export class PeriodoAcaService {
  baseUrl =  `${environment.baseUrl}api/periodoacademico/`;

  //Metodo para listar todas los periodos
  getAll() {
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }
  //Crear
  save(periodoacademico: any) {
    return axios
      .post(this.baseUrl + "create", periodoacademico)
      .then((res) => res.data);
  }

  //(Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`).then((res) => res.data);
  }
  //Metodo para actualizar un periodo basado en el id de la misma
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user)
      .then((res) => res.data);
  }
}
