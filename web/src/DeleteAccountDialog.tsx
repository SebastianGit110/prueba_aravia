import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { accountsApi, ApiError } from "./api";
import type { Account } from "./types";

interface Props {
  account: Account | null; // null = cerrado
  onClose: () => void;
  onDeleted: () => Promise<void> | void;
}

export function DeleteAccountDialog({ account, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpia el error al abrir el diálogo para otra cuenta.
  useEffect(() => setError(null), [account?.code]);

  async function confirm() {
    if (!account) return;
    setDeleting(true);
    setError(null);
    try {
      await accountsApi.remove(account.code);
      await onDeleted();
      onClose();
    } catch (err) {
      // Ej.: "No se puede eliminar: la cuenta tiene cuentas hijas."
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={!!account}
      onOpenChange={(open) => {
        if (!open && !deleting) onClose(); // no cerrar mientras elimina
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar cuenta</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar{" "}
            <span className="font-mono font-medium">{account?.code}</span> ·{" "}
            {account?.name}. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>
            {error ? "Cerrar" : "Cancelar"}
          </AlertDialogCancel>
          {/* Button (no AlertDialogAction) para que el diálogo NO se cierre solo
              y el error pueda mostrarse dentro. */}
          <Button variant="destructive" onClick={confirm} disabled={deleting}>
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deleting ? "Eliminando…" : "Eliminar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
