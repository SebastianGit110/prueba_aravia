import type {
  Account,
  AccountNode,
  CreateAccountInput,
  FieldErrors,
} from "./types";

export const VALID_LENGTHS = [1, 2, 4, 6] as const;

export const LEVEL_LABEL: Record<number, string> = {
  1: "Clase",
  2: "Grupo",
  4: "Cuenta",
  6: "Subcuenta",
};

export const NATURE_LABEL = { debit: "Débito", credit: "Crédito" } as const;

/** Código del padre: prefijo del nivel anterior. Las clases no tienen padre. */
export function parentCode(code: string): string | null {
  const idx = VALID_LENGTHS.indexOf(code.length as 1 | 2 | 4 | 6);
  if (idx <= 0) return null;
  return code.slice(0, VALID_LENGTHS[idx - 1]);
}

/** Convierte la lista plana en árbol y propaga la naturaleza de la clase. */
export function buildTree(accounts: Account[]): AccountNode[] {
  // Orden lexicográfico => un padre siempre aparece antes que sus hijos.
  const sorted = [...accounts].sort((a, b) => a.code.localeCompare(b.code));
  const byCode = new Map<string, AccountNode>();
  const roots: AccountNode[] = [];

  for (const acc of sorted) {
    const parent = byCode.get(parentCode(acc.code) ?? "");
    const node: AccountNode = {
      ...acc,
      level: acc.code.length,
      nature: acc.nature ?? parent?.nature,
      children: [],
    };
    byCode.set(acc.code, node);
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}

/** Validación previa al envío. Devuelve {} si todo está bien. */
export function validateNewAccount(
  input: CreateAccountInput,
  existing: Account[],
): FieldErrors {
  const errors: FieldErrors = {};
  const code = input.code.trim();
  const name = input.name.trim();

  if (!code) {
    errors.code = "Ingresa el código de la cuenta.";
  } else if (!/^\d+$/.test(code)) {
    errors.code = "El código solo puede tener dígitos.";
  } else if (!VALID_LENGTHS.includes(code.length as 1 | 2 | 4 | 6)) {
    errors.code =
      "El código debe tener 1, 2, 4 o 6 dígitos (clase, grupo, cuenta o subcuenta).";
  } else if (existing.some((a) => a.code === code)) {
    errors.code = `Ya existe una cuenta con el código ${code}.`;
  } else {
    const parent = parentCode(code);
    if (parent && !existing.some((a) => a.code === parent)) {
      errors.code = `No existe la cuenta padre ${parent}. Créala primero.`;
    }
  }

  if (!name) errors.name = "Ingresa el nombre de la cuenta.";
  else if (name.length > 100) errors.name = "Máximo 100 caracteres.";

  if (code.length === 1 && !input.nature) {
    errors.nature = "Elige la naturaleza de la clase.";
  }

  return errors;
}
