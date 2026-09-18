import type { NextRequest } from "next/server";
import { getMenuItems } from "@/server/menu-store";
import { delay } from "@/shared/lib/delay";
import type { MenuFilters, MenuItemsResponse, Shop } from "@/types/menu";

export const dynamic = "force-dynamic";

const shops = new Set<Shop>(["kitchen", "bar", "pastry"]);
const statuses = new Set<NonNullable<MenuFilters["status"]>>([
  "available",
  "stopped",
]);

export async function GET(request: NextRequest): Promise<Response> {
  await delay(500);

  const shopParam = request.nextUrl.searchParams.get("shop");
  const statusParam = request.nextUrl.searchParams.get("status");
  const filters: MenuFilters = {
    shop: isShop(shopParam) ? shopParam : null,
    status: isStatus(statusParam) ? statusParam : null,
  };
  const body: MenuItemsResponse = { data: getMenuItems(filters) };

  return Response.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}

function isShop(value: string | null): value is Shop {
  return value !== null && shops.has(value as Shop);
}

function isStatus(
  value: string | null,
): value is NonNullable<MenuFilters["status"]> {
  return (
    value !== null && statuses.has(value as NonNullable<MenuFilters["status"]>)
  );
}
