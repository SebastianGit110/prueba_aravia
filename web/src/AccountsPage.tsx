import { useState } from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccounts } from "./useAccounts";
import type { Account } from "./types";
import { AccountForm } from "./AccountForm";
import { AccountTree } from "./AccountTree";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export function AccountsPage() {
  const { accounts, tree, status, error, reload, refresh } = useAccounts();
  const [toDelete, setToDelete] = useState<Account | null>(null);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de cuentas</CardTitle>
          <CardDescription>
            Solo las cuentas sin hijas admiten movimientos contables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && <TreeSkeleton />}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No se pudo cargar el catálogo</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>{error}</p>
                <Button size="sm" variant="outline" onClick={reload}>
                  <RotateCw className="mr-2 h-3.5 w-3.5" /> Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {status === "ready" && <AccountTree nodes={tree} onDelete={setToDelete} />}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Nueva cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm accounts={accounts} onCreated={refresh} />
        </CardContent>
      </Card>

      <DeleteAccountDialog
        account={toDelete}
        onClose={() => setToDelete(null)}
        onDeleted={refresh}
      />
    </main>
  );
}

function TreeSkeleton() {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Cargando catálogo">
      {[0, 20, 40, 40, 20, 0, 20].map((indent, i) => (
        <Skeleton key={i} className="h-8" style={{ marginLeft: indent }} />
      ))}
    </div>
  );
}
