import { en as foundationEn } from "@novacore/frontend-foundation";
import { accessDenied } from "./access-denied";
import { columns } from "./columns";
import { filter } from "./filter";
import { pagination } from "./pagination";
import { sort } from "./sort";
import { states } from "./states";
import { userProfile } from "./user-profile";

/**
 * The English translation resource for this package's own reusable components —
 * the completeness baseline `vi`/`zh-CN` are type-checked against (`satisfies typeof en`).
 *
 * `common` is re-exported from `@novacore/frontend-foundation` rather than re-authored here:
 * it's already fully translated in `en`/`vi`/`zh-CN` and is genuinely generic UI vocabulary
 * (create/save/cancel/apply/search/...), not something this package should duplicate. Only
 * `common` is pulled in — `navigation`/`admin`/`auth`/`validation`/`errors`/`permissions`
 * stay in `frontend-foundation` since they carry domain/entity vocabulary this package must
 * not own (see the layered-i18n architecture note in `.wolf/cerebrum.md`).
 */
export const en = {
  common: foundationEn.common,
  filter,
  sort,
  pagination,
  columns,
  states,
  accessDenied,
  userProfile,
};
