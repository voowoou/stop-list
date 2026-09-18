import type { MenuFilters, Shop } from "@/types/menu";

type SearchParamValue = string | string[] | undefined;
type PageSearchParams = Record<string, SearchParamValue>;
type SearchParamsReader = Pick<URLSearchParams, "get">;

const shops = new Set<Shop>(["kitchen", "bar", "pastry"]);
const statuses = new Set<NonNullable<MenuFilters["status"]>>([
  "available",
  "stopped",
]);

function firstValue(value: SearchParamValue): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function normalizeShop(value: string | null): MenuFilters["shop"] {
  return value !== null && shops.has(value as Shop) ? (value as Shop) : null;
}

function normalizeStatus(value: string | null): MenuFilters["status"] {
  return value !== null &&
    statuses.has(value as NonNullable<MenuFilters["status"]>)
    ? (value as NonNullable<MenuFilters["status"]>)
    : null;
}

export function normalizeMenuFilters(
  searchParams: PageSearchParams,
): MenuFilters {
  return {
    shop: normalizeShop(firstValue(searchParams.shop)),
    status: normalizeStatus(firstValue(searchParams.status)),
  };
}

export function readMenuFilters(searchParams: SearchParamsReader): MenuFilters {
  return {
    shop: normalizeShop(searchParams.get("shop")),
    status: normalizeStatus(searchParams.get("status")),
  };
}

export function createMenuFiltersHref(
  pathname: string,
  searchParams: URLSearchParams,
  filters: MenuFilters,
): string {
  const params = new URLSearchParams(searchParams);

  params.delete("shop");
  params.delete("status");

  if (filters.shop !== null) {
    params.set("shop", filters.shop);
  }

  if (filters.status !== null) {
    params.set("status", filters.status);
  }

  const query = params.toString();
  return query.length > 0 ? `${pathname}?${query}` : pathname;
}
