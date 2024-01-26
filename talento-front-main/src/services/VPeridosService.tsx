import axios from "axios";
import { environment } from "../environments/environment";

export class VPeridosService {
  baseUrl = `${environment.baseUrl}api/vPerido/`;

  // Obtener el token almacenado en sessionStorage
  getToken() {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    return user?.token || "";
  }

  // Método para configurar los encabezados de autorización en las solicitudes axios
  getHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Método para listar todos los períodos
  getAll() {
    return axios.get(this.baseUrl + "read", this.getHeaders()).then((res) => res.data);
  }

  // Método para obtener un período por ID
  getID(id: number) {
    return axios.get(`${this.baseUrl}list/${id}`, this.getHeaders()).then((res) => res.data);
  }
}
