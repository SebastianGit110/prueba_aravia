import type { Account, CreateAccountInput, FieldErrors } from "./types";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

/**
 * Contrato asumido de errores de la API:
 *   422 { message, errors: { code?: string, name?: string, nature?: string } }
 *   409 { message }   (p. ej. eliminar una cuenta con hijas)
 * Ajusta `request` si tu backend usa otro formato.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: FieldErrors = {},
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor.", 0);
  }

  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? "Ocurrió un error inesperado.",
      res.status,
      body?.errors ?? {},
    );
  }
  return body as T;
}

export const accountsApi = {
  list: (signal?: AbortSignal) => request<Account[]>("/accounts", { signal }),
  create: (input: CreateAccountInput) =>
    request<Account>("/accounts", { method: "POST", body: JSON.stringify(input) }),
  remove: (code: string) =>
    request<void>(`/accounts/${code}`, { method: "DELETE" }),
};
