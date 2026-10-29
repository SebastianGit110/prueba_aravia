export type Nature = 'debit' | 'credit';

export interface Account {
  code: string;
  name: string;
  nature: Nature; // la clase la define; el resto la hereda
}

export interface AccountNode extends Account {
  children: AccountNode[];
}

/** Longitudes válidas: 1 Clase, 2 Grupo, 4 Cuenta, 6 Subcuenta. */
export const CODE_LENGTHS = [1, 2, 4, 6];

/** Padre = prefijo del nivel anterior (110505 → 1105 → 11 → 1). Las clases no tienen. */
export function parentOf(code: string): string | null {
  const i = CODE_LENGTHS.indexOf(code.length);
  return i > 0 ? code.slice(0, CODE_LENGTHS[i - 1]) : null;
}

/** Lista plana → árbol anidado. */
export function buildTree(accounts: Account[]): AccountNode[] {
  const nodes = new Map(accounts.map((a) => [a.code, { ...a, children: [] as AccountNode[] }]));
  const roots: AccountNode[] = [];

  // Ordenados por código, cada padre se procesa antes que sus hijos.
  for (const node of [...nodes.values()].sort((a, b) => a.code.localeCompare(b.code))) {
    const parent = nodes.get(parentOf(node.code) ?? '');
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}
