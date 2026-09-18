import { getMenuItem, resumeMenuItem } from "@/server/menu-store";
import { errorResponse } from "@/shared/api/error-response";
import { delay } from "@/shared/lib/delay";
import type { MenuItemResponse } from "@/types/menu";

const MUTATION_FAILURE_RATE = 0.2;

export async function POST(
  _request: Request,
  context: RouteContext<"/api/menu-items/[id]/resume">,
): Promise<Response> {
  await delay(600);

  const { id } = await context.params;
  const currentItem = getMenuItem(id);

  if (!currentItem) {
    return errorResponse(404, "MENU_ITEM_NOT_FOUND", "Позиция меню не найдена");
  }

  if (currentItem.stock === 0) {
    return errorResponse(
      409,
      "ZERO_STOCK",
      "Нельзя вернуть в продажу: остаток равен нулю",
    );
  }

  if (Math.random() < MUTATION_FAILURE_RATE) {
    return errorResponse(
      500,
      "MUTATION_FAILED",
      "Не удалось сохранить изменения. Попробуйте ещё раз",
    );
  }

  const result = resumeMenuItem(id);
  if (result.kind !== "success") {
    return errorResponse(409, "MENU_ITEM_CONFLICT", "Позиция меню изменилась");
  }

  const body: MenuItemResponse = { data: result.item };
  return Response.json(body);
}
