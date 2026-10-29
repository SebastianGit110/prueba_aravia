import type { Account, AccountNode, Nature } from '../domain/account.js';
import { buildTree, CODE_LENGTHS, parentOf } from '../domain/account.js';
import type { AccountRepository } from '../domain/account.repository.js';
import { DomainError } from '../domain/errors.js';

export class CreateAccount {
  constructor(private readonly repo: AccountRepository) {}

  async execute(input: { code: string; name: string; nature?: Nature }): Promise<Account> {
    const { code, name, nature } = input;

    // 1. Código numérico y de longitud válida
    if (typeof code !== 'string' || !/^\d+$/.test(code)) {
      throw new DomainError('validation', 'El código solo puede contener dígitos.', 'code');
    }
    if (!CODE_LENGTHS.includes(code.length)) {
      throw new DomainError('validation', 'El código debe tener 1, 2, 4 o 6 dígitos.', 'code');
    }
    if (typeof name !== 'string' || !name.trim()) {
      throw new DomainError('validation', 'El nombre es obligatorio.', 'name');
    }

    // 2. No debe existir
    if (await this.repo.findByCode(code)) {
      throw new DomainError('validation', `Ya existe una cuenta con el código ${code}.`, 'code');
    }

    // 3. El padre debe existir (las clases no tienen padre)
    const parentCode = parentOf(code);
    const parent = parentCode ? await this.repo.findByCode(parentCode) : null;
    if (parentCode && !parent) {
      throw new DomainError('validation', `No existe la cuenta padre ${parentCode}.`, 'code');
    }

    // 4. Naturaleza: la clase la define, el resto la hereda
    if (!parent && nature !== 'debit' && nature !== 'credit') {
      throw new DomainError('validation', 'Elige débito o crédito para la clase.', 'nature');
    }

    const account: Account = { code, name: name.trim(), nature: parent ? parent.nature : nature! };
    await this.repo.save(account);
    return account;
  }
}

export class ListAccounts {
  constructor(private readonly repo: AccountRepository) {}
  execute(): Promise<Account[]> {
    return this.repo.findAll();
  }
}

export class GetAccountTree {
  constructor(private readonly repo: AccountRepository) {}
  async execute(): Promise<AccountNode[]> {
    return buildTree(await this.repo.findAll());
  }
}

export class DeleteAccount {
  constructor(private readonly repo: AccountRepository) {}

  async execute(code: string): Promise<void> {
    if (!(await this.repo.findByCode(code))) {
      throw new DomainError('not_found', `No existe la cuenta ${code}.`);
    }
    if (await this.repo.hasChildren(code)) {
      throw new DomainError('conflict', `No se puede eliminar ${code}: tiene cuentas hijas.`);
    }
    await this.repo.delete(code);
  }
}
