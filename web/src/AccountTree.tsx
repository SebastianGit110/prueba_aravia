import { useState } from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LEVEL_LABEL, NATURE_LABEL } from "./domain";
import type { AccountNode } from "./types";

interface Props {
  nodes: AccountNode[];
  onDelete: (account: AccountNode) => void;
}

export function AccountTree({ nodes, onDelete }: Props) {
  // Guardamos los colapsados: así las cuentas nuevas aparecen expandidas.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (code: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  if (nodes.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aún no hay cuentas. Empieza creando una clase (por ejemplo, 1 Activo).
      </p>
    );
  }

  return (
    <ul role="tree" className="divide-y">
      {nodes.map((n) => (
        <TreeNode
          key={n.code}
          node={n}
          depth={0}
          collapsed={collapsed}
          onToggle={toggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

interface NodeProps {
  node: AccountNode;
  depth: number;
  collapsed: Set<string>;
  onToggle: (code: string) => void;
  onDelete: (account: AccountNode) => void;
}

function TreeNode({ node, depth, collapsed, onToggle, onDelete }: NodeProps) {
  const hasChildren = node.children.length > 0;
  const isOpen = !collapsed.has(node.code);

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
      <div
        className="group flex items-center gap-2 py-1.5 pr-1 hover:bg-muted/50"
        style={{ paddingLeft: depth * 20 + 4 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.code)}
            aria-label={isOpen ? "Contraer" : "Expandir"}
            className="rounded p-0.5 hover:bg-muted"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span className="w-16 shrink-0 font-mono text-sm tabular-nums">
          {node.code}
        </span>
        <span className="flex-1 truncate text-sm">{node.name}</span>

        <Badge variant="outline" className="hidden sm:inline-flex">
          {LEVEL_LABEL[node.level]}
        </Badge>
        {node.level === 1 && node.nature && (
          <Badge variant="secondary">{NATURE_LABEL[node.nature]}</Badge>
        )}
        {/* Solo las cuentas sin hijas admiten movimientos contables */}
        {!hasChildren && <Badge>Admite movimientos</Badge>}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(node)}
          aria-label={`Eliminar cuenta ${node.code} ${node.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {hasChildren && isOpen && (
        <ul role="group" className="divide-y">
          {node.children.map((c) => (
            <TreeNode
              key={c.code}
              node={c}
              depth={depth + 1}
              collapsed={collapsed}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
