import axios from "axios";
import { environment } from "../environments/environment";

export class VcarreraService {
  baseUrl = `${environment.baseUrl}api/vCarrera/`;

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

  // Método para listar todas las carreras
  getAll() {
    return axios.get(this.baseUrl + "read", this.getHeaders()).then((res) => res.data);
  }

  // Método para obtener una carrera por ID
  getID(id: number) {
    return axios.get(`${this.baseUrl}list/${id}`, this.getHeaders()).then((res) => res.data);
  }
}
