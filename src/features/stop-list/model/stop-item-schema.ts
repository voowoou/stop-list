import { z } from "zod";
import type { StopItemPayload } from "@/types/menu";

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
const STEP_MS = 15 * 60 * 1000;

export const stopItemSchema = z.object({
  reason: z.string({ error: "Выберите причину стопа" }).pipe(
    z.enum(["out_of_stock", "equipment", "quality", "menu_change"], {
      error: "Выберите причину стопа",
    }),
  ),
  until: z.iso
    .datetime({ offset: true, error: "Укажите корректные дату и время" })
    .nullable()
    .superRefine((value, context) => {
      if (value === null) return;

      const timestamp = Date.parse(value);
      if (Number.isNaN(timestamp)) return;

      const now = Date.now();
      let message: string | undefined;

      if (timestamp <= now) {
        message = "Время должно быть в будущем";
      } else if (timestamp - now > MAX_AHEAD_MS) {
        message = "Не больше чем на 24 часа вперёд";
      } else if (timestamp % STEP_MS !== 0) {
        message = "Шаг - 15 минут";
      }

      if (message) context.addIssue({ code: "custom", message });
    }),
}) satisfies z.ZodType<StopItemPayload>;

export type StopItemFormValues = z.input<typeof stopItemSchema>;
