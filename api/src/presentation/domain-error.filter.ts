import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../domain/errors.js';
import type { ErrorKind } from '../domain/errors.js';

const STATUS: Record<ErrorKind, number> = { validation: 422, not_found: 404, conflict: 409 };

/** Error de dominio → HTTP:  422 { message, errors: { campo } } · 404 · 409 { message } */
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const body: Record<string, unknown> = { message: error.message };
    if (error.field) body.errors = { [error.field]: error.message };
    host.switchToHttp().getResponse<Response>().status(STATUS[error.kind]).json(body);
  }
}
