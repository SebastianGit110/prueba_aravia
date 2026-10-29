export type ErrorKind = 'validation' | 'not_found' | 'conflict';

/** Único error de dominio: `kind` dice de qué tipo es y `field` a qué campo pertenece. */
export class DomainError extends Error {
  constructor(
    readonly kind: ErrorKind,
    message: string,
    readonly field?: 'code' | 'name' | 'nature',
  ) {
    super(message);
  }
}
