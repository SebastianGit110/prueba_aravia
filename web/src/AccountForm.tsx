import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount, isApiError } from "./api";
import { LEVEL_LABEL, NATURE_LABEL, parentCode, validateNewAccount } from "./domain";
import type { Account, AccountField, FieldErrors, Nature } from "./types";

interface Props {
  accounts: Account[];
  /** Se llama tras crear con éxito (para refrescar el árbol). */
  onCreated: () => Promise<void> | void;
}

const FIELDS: AccountField[] = ["code", "name", "nature"];

export function AccountForm({ accounts, onCreated }: Props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nature, setNature] = useState<Nature | "">("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const trimmed = code.trim();
  const isClass = trimmed.length === 1;
  const parent = parentCode(trimmed);
  const parentAccount = parent ? accounts.find((a) => a.code === parent) : undefined;

  const clearError = (field: AccountField) => {
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError(null);
    setSuccess(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // 1) Validación local: no se envía nada si hay errores.
    const input = {
      code: trimmed,
      name: name.trim(),
      nature: isClass ? (nature || undefined) : undefined,
    };
    const localErrors = validateNewAccount(input, accounts);
    setErrors(localErrors);
    setFormError(null);
    setSuccess(null);
    if (Object.keys(localErrors).length > 0) return;

    // 2) Envío + errores del servidor junto a cada campo.
    setSubmitting(true);
    try {
      await createAccount(input);
      await onCreated();
      setSuccess(`Cuenta ${input.code} · ${input.name} creada.`);
      setCode("");
      setName("");
      setNature("");
    } catch (err) {
      if (isApiError(err)) {
        const fieldErrors: FieldErrors = {};
        for (const f of FIELDS) if (err.fieldErrors[f]) fieldErrors[f] = err.fieldErrors[f];
        setErrors(fieldErrors);
        // Si ningún error corresponde a un campo, se muestra arriba del formulario.
        if (Object.keys(fieldErrors).length === 0) setFormError(err.message);
      } else {
        setFormError("No se pudo crear la cuenta. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Field id="code" label="Código" error={errors.code}>
        <Input
          id="code"
          inputMode="numeric"
          maxLength={6}
          placeholder="Ej. 110505"
          className="font-mono"
          value={code}
          disabled={submitting}
          aria-invalid={!!errors.code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ""));
            clearError("code");
          }}
        />
        {trimmed && LEVEL_LABEL[trimmed.length] && !errors.code && (
          <p className="text-xs text-muted-foreground">
            {LEVEL_LABEL[trimmed.length]}
            {parent &&
              (parentAccount
                ? ` de ${parent} · ${parentAccount.name}`
                : ` · el padre ${parent} aún no existe`)}
          </p>
        )}
      </Field>

      <Field id="name" label="Nombre" error={errors.name}>
        <Input
          id="name"
          value={name}
          disabled={submitting}
          aria-invalid={!!errors.name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
        />
      </Field>

      {isClass && (
        <Field id="nature" label="Naturaleza" error={errors.nature}>
          <Select
            value={nature}
            disabled={submitting}
            onValueChange={(v) => {
              setNature(v as Nature);
              clearError("nature");
            }}
          >
            <SelectTrigger id="nature" aria-invalid={!!errors.nature}>
              <SelectValue placeholder="Selecciona…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit">{NATURE_LABEL.debit}</SelectItem>
              <SelectItem value="credit">{NATURE_LABEL.credit}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitting ? "Creando…" : "Crear cuenta"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
