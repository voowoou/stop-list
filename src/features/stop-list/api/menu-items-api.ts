import { fetchJson } from "@/shared/api/fetch-json";
import type {
  MenuFilters,
  MenuItem,
  MenuItemResponse,
  MenuItemsResponse,
  StopItemPayload,
} from "@/types/menu";

export async function fetchMenuItems(
  filters: MenuFilters,
): Promise<MenuItem[]> {
  const response = await fetchJson<MenuItemsResponse>(
    `/api/menu-items?${createMenuSearchParams(filters)}`,
  );
  return response.data;
}

export async function stopMenuItem(
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> {
  const response = await fetchJson<MenuItemResponse>(
    `/api/menu-items/${encodeURIComponent(id)}/stop`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function resumeMenuItem(id: string): Promise<MenuItem> {
  const response = await fetchJson<MenuItemResponse>(
    `/api/menu-items/${encodeURIComponent(id)}/resume`,
    { method: "POST" },
  );
  return response.data;
}

function createMenuSearchParams(filters: MenuFilters): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (filters.shop) searchParams.set("shop", filters.shop);
  if (filters.status) searchParams.set("status", filters.status);
  return searchParams;
}
