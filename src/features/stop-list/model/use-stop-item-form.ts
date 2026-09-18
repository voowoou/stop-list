"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { StopItemPayload } from "@/types/menu";
import { type StopItemFormValues, stopItemSchema } from "./stop-item-schema";

export function useStopItemForm(initialValues?: StopItemPayload) {
  return useForm<StopItemFormValues, unknown, StopItemPayload>({
    resolver: zodResolver(stopItemSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: initialValues ?? { reason: "", until: null },
  });
}
