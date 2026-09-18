import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { MenuFilters, MenuItem } from "@/types/menu";
import { menuKeys } from "./queries";

export interface MenuCacheSnapshot {
  queryKey: QueryKey;
  data: MenuItem[];
}

export async function updateMenuItemOptimistically(
  queryClient: QueryClient,
  id: string,
  update: (item: MenuItem) => MenuItem,
): Promise<MenuCacheSnapshot[]> {
  await queryClient.cancelQueries({ queryKey: menuKeys.lists() });

  const cachedLists = queryClient.getQueriesData<MenuItem[]>({
    queryKey: menuKeys.lists(),
  });
  const snapshots: MenuCacheSnapshot[] = cachedLists.flatMap(
    ([queryKey, data]) => (data ? [{ queryKey, data }] : []),
  );
  const currentItem = snapshots
    .flatMap(({ data }) => data)
    .find((item) => item.id === id);

  if (!currentItem) return snapshots;

  const updatedItem = update(currentItem);

  for (const { queryKey, data } of snapshots) {
    const filters = getFilters(queryKey);
    if (!filters) continue;

    queryClient.setQueryData<MenuItem[]>(
      queryKey,
      reconcileMenuItems(data, updatedItem, filters),
    );
  }

  return snapshots;
}

export function rollbackMenuItemOptimisticUpdate(
  queryClient: QueryClient,
  itemId: string,
  snapshots: MenuCacheSnapshot[],
): void {
  const originalItem = snapshots
    .flatMap(({ data }) => data)
    .find((item) => item.id === itemId);

  if (!originalItem) return;

  for (const { queryKey, data } of snapshots) {
    const filters = getFilters(queryKey);
    if (!filters) continue;

    queryClient.setQueryData<MenuItem[]>(queryKey, (currentData) =>
      reconcileMenuItems(currentData ?? data, originalItem, filters),
    );
  }
}

function reconcileMenuItems(
  items: MenuItem[],
  updatedItem: MenuItem,
  filters: MenuFilters,
): MenuItem[] {
  const itemIndex = items.findIndex((item) => item.id === updatedItem.id);
  const shouldInclude = matchesFilters(updatedItem, filters);

  if (!shouldInclude) {
    return itemIndex === -1
      ? items
      : items.filter((item) => item.id !== updatedItem.id);
  }

  if (itemIndex === -1) return [...items, updatedItem];

  return items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
}

function matchesFilters(item: MenuItem, filters: MenuFilters): boolean {
  return (
    (filters.shop === null || item.shop === filters.shop) &&
    (filters.status === null || item.status.kind === filters.status)
  );
}

function getFilters(queryKey: QueryKey): MenuFilters | null {
  const filters: unknown = queryKey[2];
  if (!isRecord(filters)) return null;

  const { shop, status } = filters;
  const isShop =
    shop === null || shop === "kitchen" || shop === "bar" || shop === "pastry";
  const isStatus =
    status === null || status === "available" || status === "stopped";

  return isShop && isStatus ? { shop, status } : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
