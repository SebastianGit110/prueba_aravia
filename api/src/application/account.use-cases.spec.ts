import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryAccountRepository } from '../infrastructure/in-memory-account.repository.js';
import { CreateAccount, DeleteAccount, GetAccountTree } from './account.use-cases.js';

describe('Catálogo de cuentas', () => {
  let create: CreateAccount, tree: GetAccountTree, remove: DeleteAccount;

  beforeEach(async () => {
    const repo = new InMemoryAccountRepository();
    create = new CreateAccount(repo);
    tree = new GetAccountTree(repo);
    remove = new DeleteAccount(repo);

    await create.execute({ code: '1', name: 'Activo', nature: 'debit' });
    await create.execute({ code: '11', name: 'Disponible' });
    await create.execute({ code: '1105', name: 'Caja' });
    await create.execute({ code: '110505', name: 'Caja general' });
  });

  describe('crear', () => {
    it.each(['abc', '12a', '1.5'])('rechaza código no numérico: %s', (code) =>
      expect(create.execute({ code, name: 'X' })).rejects.toMatchObject({ kind: 'validation', field: 'code' }));

    it.each(['111', '11050', '1105051'])('rechaza longitud inválida: %s', (code) =>
      expect(create.execute({ code, name: 'X' })).rejects.toMatchObject({ kind: 'validation', field: 'code' }));

    it('rechaza código repetido', () =>
      expect(create.execute({ code: '1105', name: 'Otra' })).rejects.toMatchObject({ field: 'code' }));

    it('rechaza si el padre no existe', () =>
      expect(create.execute({ code: '2105', name: 'Bancos' })).rejects.toMatchObject({ field: 'code' }));

    it('la clase exige naturaleza y los hijos la heredan', async () => {
      await expect(create.execute({ code: '2', name: 'Pasivo' })).rejects.toMatchObject({ field: 'nature' });
      expect(await create.execute({ code: '110510', name: 'Caja menor' })).toMatchObject({ nature: 'debit' });
    });
  });

  it('consulta el catálogo como árbol anidado', async () => {
    const [activo] = await tree.execute();
    expect(activo.children[0].children[0].children.map((c) => c.code)).toEqual(['110505']);
  });

  describe('eliminar', () => {
    it('rechaza si tiene hijas', () =>
      expect(remove.execute('1105')).rejects.toMatchObject({ kind: 'conflict' }));

    it('elimina de abajo hacia arriba', async () => {
      await remove.execute('110505');
      await remove.execute('1105');
      expect((await tree.execute())[0].children[0].children).toEqual([]);
    });

    it('404 si no existe', () =>
      expect(remove.execute('9999')).rejects.toMatchObject({ kind: 'not_found' }));
  });
});
