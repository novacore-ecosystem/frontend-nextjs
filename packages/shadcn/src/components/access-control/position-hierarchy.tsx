"use client";

import { ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";
import type { PositionRecord, PositionTreeNode } from "./types";

export interface PositionHierarchyProps {
  nodes: PositionTreeNode[];
  selectedId?: string;
  onSelect?: (node: PositionTreeNode) => void;
  /** Rendered on the right of each row, revealed on hover — typically edit/add-child/delete icon buttons. */
  renderActions?: (node: PositionTreeNode) => React.ReactNode;
  className?: string;
}

/** Reusable superior/subordinate tree view — the shared rendering behind `PositionManagement`'s tree mode (section 8). Purely presentational: fetching/building the tree is the caller's job. */
export function PositionHierarchy({ nodes, selectedId, onSelect, renderActions, className }: PositionHierarchyProps) {
  return (
    <div role="tree" className={cn("flex flex-col gap-0.5", className)}>
      {nodes.map((node) => (
        <PositionHierarchyNode
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          renderActions={renderActions}
        />
      ))}
    </div>
  );
}

function PositionHierarchyNode({
  node,
  depth,
  selectedId,
  onSelect,
  renderActions,
}: {
  node: PositionTreeNode;
  depth: number;
  selectedId?: string;
  onSelect?: (node: PositionTreeNode) => void;
  renderActions?: (node: PositionTreeNode) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  const hasChildren = node.children.length > 0;
  const selected = node.id === selectedId;

  return (
    <div role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-selected={selected}>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md py-1.5 pr-2 text-sm",
          onSelect && "cursor-pointer hover:bg-accent/50",
          selected && "bg-accent text-accent-foreground",
        )}
        style={{ paddingLeft: `${depth * 20 + 4}px` }}
        onClick={() => onSelect?.(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-accent"
            aria-label={open ? "Collapse" : "Expand"}
          >
            <ChevronRight className={cn("size-3.5 transition-transform", open && "rotate-90")} />
          </button>
        ) : (
          <span className="size-5 shrink-0" />
        )}
        <span className="flex-1 truncate">{node.name}</span>
        {renderActions ? (
          <span
            className="flex shrink-0 items-center gap-1 opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            onClick={(event) => event.stopPropagation()}
          >
            {renderActions(node)}
          </span>
        ) : null}
      </div>
      {hasChildren && open ? (
        <div>
          {node.children.map((child) => (
            <PositionHierarchyNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              renderActions={renderActions}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Flattens a position tree into `[{ id, name, depth }]`, depth-first — used to build indented `PositionSelector` options and to resolve a position's ancestor chain for search-expansion. */
export function flattenPositionTree(nodes: PositionTreeNode[], depth = 0): { id: string; name: string; depth: number }[] {
  return nodes.flatMap((node) => [
    { id: node.id, name: node.name, depth },
    ...flattenPositionTree(node.children, depth + 1),
  ]);
}

/** Ids of `rootId` and every descendant — used to exclude a position (and its own subtree) from its own `PositionSelector`'s parent options, preventing a hierarchy cycle. */
export function collectDescendantIds(node: PositionTreeNode): Set<string> {
  const ids = new Set<string>([node.id]);
  for (const child of node.children) {
    for (const id of collectDescendantIds(child)) ids.add(id);
  }
  return ids;
}

/** Finds a node anywhere in the tree by id, depth-first. */
export function findPositionNode(nodes: PositionTreeNode[], id: string): PositionTreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findPositionNode(node.children, id);
    if (found) return found;
  }
  return null;
}

/** Builds a `PositionTreeNode[]` forest from a flat `parentId`-linked list — for adapters whose backend only returns a flat list (`PositionService.getList`) and has no dedicated tree endpoint. Positions whose `parentId` doesn't resolve to another record in the list are treated as roots. */
export function buildPositionTree(records: PositionRecord[]): PositionTreeNode[] {
  const byId = new Map<string, PositionTreeNode>(records.map((record) => [record.id, { ...record, children: [] }]));
  const roots: PositionTreeNode[] = [];

  for (const record of records) {
    const node = byId.get(record.id)!;
    const parent = record.parentId ? byId.get(record.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  return roots;
}
