import { http } from "./http";
import type { Account, CreateAccountInput } from "./types";

export { isApiError } from "./api-error";

export async function listAccounts(signal?: AbortSignal): Promise<Account[]> {
  const { data } = await http.get<Account[]>("/accounts", { signal });
  return data;
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const { data } = await http.post<Account>("/accounts", input);
  return data;
}

export async function removeAccount(code: string): Promise<void> {
  await http.delete(`/accounts/${encodeURIComponent(code)}`);
}
