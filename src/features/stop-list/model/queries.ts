import { queryOptions } from "@tanstack/react-query";
import type { MenuFilters } from "@/types/menu";
import { fetchMenuItems } from "../api/menu-items-api";

export const menuKeys = {
  all: ["menu-items"] as const,
  lists: () => [...menuKeys.all, "list"] as const,
  list: (filters: MenuFilters) => [...menuKeys.lists(), filters] as const,
};

export const menuMutationKeys = {
  all: [...menuKeys.all, "mutation"] as const,
  stop: () => [...menuMutationKeys.all, "stop"] as const,
  resume: () => [...menuMutationKeys.all, "resume"] as const,
};

export function menuListOptions(filters: MenuFilters) {
  return queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
  });
}
