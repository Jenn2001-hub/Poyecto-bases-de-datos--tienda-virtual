// src/services/AuthService.js
import API_URL from "./api";

const AuthService = {
  /**
   * Inicia sesión contra el backend.
   * Devuelve un objeto { user: { ... } }
   */
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Primero obtenemos el texto de la respuesta
      const text = await res.text();
      
      if (!res.ok) {
        // Intentar parsear el error como JSON
        let errorMessage = "Credenciales incorrectas";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa, parsear el JSON
      return JSON.parse(text);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  /**
   * Registra un nuevo cliente.
   * data se espera con: { nombre, correo, contraseña, telefono, ... }
   */
  register: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Primero obtenemos el texto de la respuesta
      const text = await res.text();
      
      if (!res.ok) {
        // Intentar parsear el error como JSON
        let errorMessage = "Error al registrarse";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa, parsear el JSON
      const result = JSON.parse(text);
      
      // Asegurarnos de que la respuesta tenga la estructura esperada
      if (!result.user) {
        console.warn("El backend no devolvió 'user', ajustando respuesta");
        return {
          user: {
            id: result.id || result.idCliente,
            nombre: result.nombre,
            correo: result.correo || data.correo,
            telefono: result.telefono
          },
          message: result.message || "Registro exitoso"
        };
      }
      
      return result;
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  },
};

export default AuthService;