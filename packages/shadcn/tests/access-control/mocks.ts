import type {
  AccessControlServices,
  PermissionGroup,
  PositionRecord,
  RoleRecord,
} from "../../src/components/access-control/types";
import { buildPositionTree } from "../../src/components/access-control/position-hierarchy";

export const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: "order",
    categoryLabel: "Orders",
    permissions: [
      { id: "order:view", category: "order", displayName: "View orders" },
      { id: "order:manage", category: "order", displayName: "Manage orders" },
    ],
  },
  {
    category: "inventory",
    categoryLabel: "Inventory",
    permissions: [
      { id: "inventory:view", category: "inventory", displayName: "View inventory" },
      { id: "inventory:adjust", category: "inventory", displayName: "Adjust inventory" },
    ],
  },
];

/**
 * An in-memory `AccessControlServices` implementation for tests — exercises the real
 * `AccessControlProvider` -> component -> service round trip instead of mocking at the
 * component boundary, so tests catch contract mismatches too.
 */
export function createMockServices(seed?: {
  roles?: RoleRecord[];
  positions?: PositionRecord[];
  assignments?: Record<string, string[]>;
}): AccessControlServices {
  const roles = new Map<string, RoleRecord>((seed?.roles ?? []).map((role) => [role.id, role]));
  const positions = new Map<string, PositionRecord>((seed?.positions ?? []).map((position) => [position.id, position]));
  const assignments = new Map<string, string[]>(Object.entries(seed?.assignments ?? {}));
  let roleSeq = 0;
  let positionSeq = 0;

  return {
    permissions: {
      async getGroups() {
        return MOCK_PERMISSION_GROUPS;
      },
      async getById(id) {
        return MOCK_PERMISSION_GROUPS.flatMap((group) => group.permissions).find((record) => record.id === id) ?? null;
      },
      async updateTranslations(id, translations) {
        const record = MOCK_PERMISSION_GROUPS.flatMap((group) => group.permissions).find((r) => r.id === id);
        if (!record) throw new Error(`Unknown permission: ${id}`);
        const [translation] = translations;
        return { ...record, displayName: translation.displayName, description: translation.description };
      },
    },
    roles: {
      async getList({ keyword, page = 1, pageSize = 20 }) {
        const all = [...roles.values()].filter(
          (role) => !keyword || role.name.toLowerCase().includes(keyword.toLowerCase()),
        );
        const start = (page - 1) * pageSize;
        const items = all.slice(start, start + pageSize);
        return {
          items,
          pageNumber: page,
          pageSize,
          totalCount: all.length,
          hasNextPage: start + pageSize < all.length,
          hasPreviousPage: page > 1,
          totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
        };
      },
      async getById(id) {
        return roles.get(id) ?? null;
      },
      async create(input) {
        const id = `role-${++roleSeq}`;
        const record: RoleRecord = { id, ...input, permissionCount: 0 };
        roles.set(id, record);
        assignments.set(`role:${id}`, []);
        return record;
      },
      async update(id, input) {
        const existing = roles.get(id);
        if (!existing) throw new Error(`Unknown role: ${id}`);
        const updated = { ...existing, ...input };
        roles.set(id, updated);
        return updated;
      },
      async delete(id) {
        roles.delete(id);
        assignments.delete(`role:${id}`);
      },
    },
    positions: {
      async getList({ keyword, page = 1, pageSize = 20 }) {
        const all = [...positions.values()].filter(
          (position) => !keyword || position.name.toLowerCase().includes(keyword.toLowerCase()),
        );
        const start = (page - 1) * pageSize;
        const items = all.slice(start, start + pageSize);
        return {
          items,
          pageNumber: page,
          pageSize,
          totalCount: all.length,
          hasNextPage: start + pageSize < all.length,
          hasPreviousPage: page > 1,
          totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
        };
      },
      async getTree() {
        return buildPositionTree([...positions.values()]);
      },
      async getById(id) {
        return positions.get(id) ?? null;
      },
      async create(input) {
        const id = `position-${++positionSeq}`;
        const record: PositionRecord = { id, ...input };
        positions.set(id, record);
        assignments.set(`position:${id}`, []);
        return record;
      },
      async update(id, input) {
        const existing = positions.get(id);
        if (!existing) throw new Error(`Unknown position: ${id}`);
        const updated = { ...existing, ...input };
        positions.set(id, updated);
        return updated;
      },
      async delete(id) {
        positions.delete(id);
        assignments.delete(`position:${id}`);
      },
    },
    assignments: {
      async getAssignedPermissions(subjectType, subjectId) {
        return { permissionIds: assignments.get(`${subjectType}:${subjectId}`) ?? [] };
      },
      async assignPermissions(subjectType, subjectId, permissionIds) {
        assignments.set(`${subjectType}:${subjectId}`, permissionIds);
      },
    },
  };
}
