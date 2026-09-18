import { stopItemSchema } from "@/features/stop-list/model/stop-item-schema";
import { getMenuItem, stopMenuItem } from "@/server/menu-store";
import { errorResponse } from "@/shared/api/error-response";
import { delay } from "@/shared/lib/delay";
import type { MenuItemResponse } from "@/types/menu";

const MUTATION_FAILURE_RATE = 0.2;

export async function POST(
  request: Request,
  context: RouteContext<"/api/menu-items/[id]/stop">,
): Promise<Response> {
  await delay(600);

  const payload = await readJson(request);
  if (payload === null) {
    return errorResponse(400, "INVALID_JSON", "Тело запроса должно быть JSON");
  }

  const parsed = stopItemSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return errorResponse(
      400,
      "VALIDATION_ERROR",
      "Проверьте заполнение формы",
      fieldErrors,
    );
  }

  const { id } = await context.params;
  if (!getMenuItem(id)) {
    return errorResponse(404, "MENU_ITEM_NOT_FOUND", "Позиция меню не найдена");
  }

  if (Math.random() < MUTATION_FAILURE_RATE) {
    return errorResponse(
      500,
      "MUTATION_FAILED",
      "Не удалось сохранить изменения. Попробуйте ещё раз",
    );
  }

  const item = stopMenuItem(id, parsed.data);
  if (!item) {
    return errorResponse(404, "MENU_ITEM_NOT_FOUND", "Позиция меню не найдена");
  }

  const body: MenuItemResponse = { data: item };
  return Response.json(body);
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
}
