import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CreateAccount, DeleteAccount, GetAccountTree, ListAccounts } from './application/account.use-cases.js';
import { ACCOUNT_REPOSITORY, AccountRepository } from './domain/account.repository.js';
import { InMemoryAccountRepository } from './infraestructure/in-memory-account.repository.js';
import { AccountsController } from './presentation/accounts.controller.js';
import { DomainErrorFilter } from './presentation/domain-error.filter.js';

// Los casos de uso son clases planas; aquí se les entrega el repositorio.
const useCase = <T>(UseCase: new (repo: AccountRepository) => T) => ({
  provide: UseCase,
  useFactory: (repo: AccountRepository) => new UseCase(repo),
  inject: [ACCOUNT_REPOSITORY],
});

@Module({
  controllers: [AccountsController],
  providers: [
    // Para usar PostgreSQL basta cambiar esta línea.
    { provide: ACCOUNT_REPOSITORY, useClass: InMemoryAccountRepository },
    useCase(CreateAccount),
    useCase(ListAccounts),
    useCase(GetAccountTree),
    useCase(DeleteAccount),
    { provide: APP_FILTER, useClass: DomainErrorFilter },
  ],
})
export class AppModule {}
