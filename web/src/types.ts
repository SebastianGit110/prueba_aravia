export type Nature = "debit" | "credit";

export interface Account {
  code: string;
  name: string;
  /** Solo las clases (1 dígito) la definen; el resto la hereda. */
  nature?: Nature;
}

export interface AccountNode extends Account {
  nature: Nature | undefined; // ya heredada
  level: number; // 1 | 2 | 4 | 6 (longitud del código)
  children: AccountNode[];
}

export interface CreateAccountInput {
  code: string;
  name: string;
  nature?: Nature; // solo se envía si es clase
}

export type AccountField = "code" | "name" | "nature";
export type FieldErrors = Partial<Record<AccountField, string>>;
