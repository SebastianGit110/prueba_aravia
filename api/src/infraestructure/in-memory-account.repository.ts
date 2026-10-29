import { Injectable } from '@nestjs/common';
import { parentOf } from '../domain/account.js';
import type { Account } from '../domain/account.js';
import type { AccountRepository } from '../domain/account.repository.js';

/** "Tabla" accounts en memoria: la clave del Map es la llave primaria (code). */
@Injectable()
export class InMemoryAccountRepository implements AccountRepository {
  private readonly table = new Map<string, Account>();

  async findByCode(code: string) {
    const row = this.table.get(code);
    return row ? { ...row } : null; // copia: nadie modifica la "BD" por referencia
  }

  async findAll() {
    return [...this.table.values()].map((a) => ({ ...a }));
  }

  async hasChildren(code: string) {
    return [...this.table.keys()].some((c) => parentOf(c) === code);
  }

  async save(account: Account) {
    this.table.set(account.code, { ...account });
  }

  async delete(code: string) {
    this.table.delete(code);
  }
}
