import axios from "axios";
import { environment } from "../environments/environment";

export class ContratoService {
  baseUrl =  `${environment.baseUrl}api/contrato/`;

  //Metodo para listar todas los Contratos
  getAll() {
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }

  getAllByContrato(id: number) {
    return axios
      .get(`${this.baseUrl}readContrato/${id}`)
      .then((res) => res.data);
  }

  getAllByPersona(id: number) {
    return axios
      .get(`${this.baseUrl}readContratoPersona/${id}`)
      .then((res) => res.data);
  }
  //Crear
  save(contrato: any) {
    return axios
      .post(this.baseUrl + "create", contrato)
      .then((res) => res.data);
  }

  //(Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`).then((res) => res.data);
  }
  //Metodo para actualizar un Contrato basado en el id de la misma
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user)
      .then((res) => res.data);
  }

  getByEvidencia(id: Number | undefined) {
    return axios
        .get(`${this.baseUrl}${id}/evidencia`)
        .then((res) => res.data);
  }

}
