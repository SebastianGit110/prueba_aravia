import type { Account } from './account.js';

export interface AccountRepository {
  findByCode(code: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
  hasChildren(code: string): Promise<boolean>;
  save(account: Account): Promise<void>;
  delete(code: string): Promise<void>;
}

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');
