# Catálogo de cuentas – backend (NestJS + Clean Architecture)

```
src/
├─ domain/          Reglas puras (sin NestJS ni BD): Account, parentOf, buildTree,
│                   DomainError y la interfaz AccountRepository
├─ application/     Casos de uso: CreateAccount, GetAccountTree, DeleteAccount (+ ListAccounts)
├─ infrastructure/  InMemoryAccountRepository (un Map)
├─ presentation/    Controller + filtro de errores
└─ app.module.ts    Une las capas
```
Dependencias: presentation → application → domain ← infrastructure

`npm install` · `npm test` · `npm run start:dev` → http://localhost:3000/api

| Método | Ruta | Éxito | Errores |
|---|---|---|---|
| POST | /accounts `{code,name,nature?}` | 201 | 422 `{message, errors:{campo}}` |
| GET | /accounts/tree | 200 árbol anidado | |
| GET | /accounts | 200 lista plana (la usa el frontend) | |
| DELETE | /accounts/:code | 204 | 404 no existe · 409 tiene hijas |
