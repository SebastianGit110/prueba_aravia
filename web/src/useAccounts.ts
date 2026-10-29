import { isCancel } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { listAccounts } from "./api";
import { buildTree } from "./domain";
import type { Account } from "./types";

type Status = "loading" | "ready" | "error";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  /** `silent` refresca sin mostrar el estado de carga (tras crear/eliminar). */
  const load = useCallback(async (opts?: { silent?: boolean; signal?: AbortSignal }) => {
    if (!opts?.silent) setStatus("loading");
    try {
      setAccounts(await listAccounts(opts?.signal));
      setError(null);
      setStatus("ready");
    } catch (e) {
      if (isCancel(e)) return; // la petición se canceló al desmontar
      setError((e as Error).message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load({ signal: ctrl.signal });
    return () => ctrl.abort();
  }, [load]);

  const tree = useMemo(() => buildTree(accounts), [accounts]);

  return {
    accounts,
    tree,
    status,
    error,
    reload: () => load(),
    refresh: () => load({ silent: true }),
  };
}
