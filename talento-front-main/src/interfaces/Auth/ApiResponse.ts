// Define la interfaz para la respuesta del servidor en general
export interface ApiResponse {
  data: any[];
  id_usuario: number;
  username: string;
  password: string;
  persona: {
    id_persona: number;
  };
  rol: {
    idRol: number;
  };
  // Cambia el tipo de la propiedad jwtResponse
  jwtResponse: {
    token: string;
  };
}
