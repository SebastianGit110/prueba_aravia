import type { FieldErrors } from "./types";

/** Error de la API: un Error normal con el status HTTP y los errores por campo. */
export type ApiError = Error & { status: number; fieldErrors: FieldErrors };

export function createApiError(
  message: string,
  status: number,
  fieldErrors: FieldErrors = {},
): ApiError {
  return Object.assign(new Error(message), { status, fieldErrors });
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && "status" in error && "fieldErrors" in error;
}
