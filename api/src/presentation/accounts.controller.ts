import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { CreateAccount, DeleteAccount, GetAccountTree, ListAccounts } from '../application/account.use-cases.js';
import type { Nature } from '../domain/account.js';

class CreateAccountDto {
  code!: string;
  name!: string;
  nature?: Nature;
}

@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(CreateAccount) private readonly createAccount: CreateAccount,
    @Inject(ListAccounts) private readonly listAccounts: ListAccounts,
    @Inject(GetAccountTree) private readonly getTree: GetAccountTree,
    @Inject(DeleteAccount) private readonly deleteAccount: DeleteAccount,
  ) {}

  @Get() list() { return this.listAccounts.execute(); }

  @Get('tree') tree() { return this.getTree.execute(); }

  @Post() create(@Body() dto: CreateAccountDto) { return this.createAccount.execute(dto ?? {}); }

  @Delete(':code') @HttpCode(204)
  async remove(@Param('code') code: string) { await this.deleteAccount.execute(code); }
}
