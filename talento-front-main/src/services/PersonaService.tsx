import axios from "axios";
import { IResumen } from "../interfaces/Primary/IResumen";
import { environment } from "../environments/environment";

export class PersonaService {
  baseUrl = `${environment.baseUrl}api/persona/`;

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

  // Método para obtener una persona por su ID
  getById(id: number) {
    return axios.get(`${this.baseUrl}combined/${id}`, this.getHeaders()).then((res) => res.data);
  }

  // Método para listar todas las personas
  getAll() {
    return axios.get(this.baseUrl + "read", this.getHeaders()).then((res) => res.data);
  }

  // Crear
  save(persona: any) {
    return axios.post(this.baseUrl + "create", persona, this.getHeaders()).then((res) => res.data);
  }

  // (Eliminado lógico)
  delete(id: number) {
    return axios.delete(`${this.baseUrl}delete/${id}`, this.getHeaders()).then((res) => res.data);
  }

  // Obtener todos por persona
  getAllByPersona(id: any) {
    return axios
      .get(`${this.baseUrl}readPersona/${id}`, this.getHeaders())
      .then((res) => res.data
      );

  }

  // Obtener resumen por ID
  getSummary(id: number) {
    return axios
      .get(`${this.baseUrl}combined/${id}`, this.getHeaders())
      .then((response) => response.data as IResumen)
      .catch((error) => {
        throw error;
      });
  }

  // Obtener resumen por cédula
  getSummarySecre(cedula: string) {
    return axios
      .get(`${this.baseUrl}combi/${cedula}`, this.getHeaders())
      .then((response) => response.data as IResumen)
      .catch((error) => {
        throw error;
      });
  }

  // Método para actualizar una persona basado en el ID
  update(id: number, user: any) {
    return axios
      .put(this.baseUrl + "update/" + id.toString(), user, this.getHeaders())
      .then((res) => res.data);
  }
}
