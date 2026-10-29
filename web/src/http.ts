import axios from "axios";
import { createApiError } from "./api-error";

/** Instancia única de axios: toda petición al backend pasa por aquí. */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000, // evita spinners infinitos si el servidor no responde
});

/**
 * Normaliza los errores. Contrato de la API:
 *   422 { message, errors: { code?, name?, nature? } }
 *   404 / 409 { message }
 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Una petición cancelada (AbortController) no es un error de la API.
    if (axios.isCancel(error)) return Promise.reject(error);

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        return Promise.reject(createApiError("No se pudo conectar con el servidor.", 0));
      }
      const { status, data } = error.response;
      return Promise.reject(
        createApiError(data?.message ?? "Ocurrió un error inesperado.", status, data?.errors ?? {}),
      );
    }
    return Promise.reject(error);
  },
);
