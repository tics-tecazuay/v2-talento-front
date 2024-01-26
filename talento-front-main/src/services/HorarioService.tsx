import axios from "axios";
import { environment } from "../environments/environment";

export class HorarioService {
  baseUrl = `${environment.baseUrl}api/horario/`;

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

  // Método para listar todas los horarios
  getAll() {
    return axios.get(this.baseUrl + "read", this.getHeaders()).then((res) => res.data);
  }

  // Crear
  save(horario: any) {
    return axios.post(this.baseUrl + "create", horario, this.getHeaders()).then((res) => res.data);
  }

  // Obtener todos por horario
  getAllByHorario(id: number) {
    return axios
      .get(`${this.baseUrl}readHorario/${id}`, this.getHeaders())
      .then((res) => res.data);
  }

  // Obtener todos por persona
  getAllByPersona(id: number) {
    return axios
      .get(`${this.baseUrl}readHorarioPersona/${id}`, this.getHeaders())
      .then((res) => res.data);
  }

  // (Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`, this.getHeaders()).then((res) => res.data);
  }

  // Método para actualizar un horario basado en el id
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user, this.getHeaders())
      .then((res) => res.data);
  }

  getByDistributivo(id: Number | undefined) {
    return axios
        .get(`${this.baseUrl}${id}/distributivo`, this.getHeaders())
        .then((res) => res.data);
  }
}
