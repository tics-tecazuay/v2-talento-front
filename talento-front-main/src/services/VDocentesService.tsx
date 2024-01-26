import axios from "axios";
import { environment } from "../environments/environment";

export class vDocenteService {
  baseUrl =  `${environment.baseUrl}api/vDocente/`;

  getAll() {
    return axios.get(this.baseUrl + "read").then((res) => res.data);
  }

  getID(id: number) {
    return axios.get(`${this.baseUrl}list/${id}`).then((res) => res.data);
  }
}
