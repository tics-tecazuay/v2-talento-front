import { ApiResponse } from "../../interfaces/Auth/ApiResponse";
import { User } from "../../interfaces/Auth/UserL";
import { fasicellService } from "./FasicellService";

export class AuthService {
  // El método signin en la clase AuthService se utiliza para
  // enviar una solicitud HTTP POST a la API con la ruta /signin
  // y un objeto User como datos. Devuelve una Promise que se resuelve
  // con un objeto ApiResponse o se rechaza con un error si la solicitud falla.
  public static async signin(obj: User): Promise<ApiResponse> {
    try {
      const response = await fasicellService.post("api/usuario/signin", obj);
      return response.data;
    } catch (error) {
      throw error; // Puedes manejar el error según tus necesidades
    }
  }

  // El método login en la clase AuthService se utiliza para
  // enviar una solicitud HTTP POST a la API con la ruta /generate-token
  // y un objeto User como datos. Devuelve una Promise que se resuelve
  // con un objeto ApiResponse o se rechaza con un error si la solicitud falla.
  public static async login(obj: User): Promise<ApiResponse> {
    try {
      const response = await fasicellService.post("generate-token", obj);
      return response.data;
    } catch (error) {
      throw error; // Puedes manejar el error según tus necesidades
    }
  }
}