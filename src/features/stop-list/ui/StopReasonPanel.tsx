"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { getApiErrorMessage } from "@/shared/api/api-error";
import {
  getNextQuarterHour,
  isoToLocalDateTime,
  localDateTimeToIso,
} from "@/shared/lib/date";
import { Button } from "@/shared/ui/Button";
import { FilterTab } from "@/shared/ui/FilterTab";
import { CloseIcon } from "@/shared/ui/icons/CloseIcon";
import type { MenuItem, StopReason } from "@/types/menu";
import { stopReasonLabels } from "@/types/menu";
import { useStopItem } from "../model/use-stop-item";
import { useStopItemForm } from "../model/use-stop-item-form";
import { useStopListUi } from "../model/use-stop-list-ui";

type UntilMode = "shift" | "time";

interface StopReasonPanelProps {
  item: MenuItem | null;
}

const reasonOptions = Object.entries(stopReasonLabels) as [
  StopReason,
  string,
][];

export function StopReasonPanel({ item }: StopReasonPanelProps) {
  const isOpen = useStopListUi((state) => state.isPanelOpen);
  const mode = useStopListUi((state) => state.panelMode);
  const closePanel = useStopListUi((state) => state.closePanel);
  const addToast = useStopListUi((state) => state.addToast);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(item);
  const [untilMode, setUntilMode] = useState<UntilMode>("shift");
  const stopMutation = useStopItem();
  const form = useStopItemForm();

  useEffect(() => {
    if (!isOpen || !item) return;

    setActiveItem(item);
    const stoppedStatus = item.status.kind === "stopped" ? item.status : null;
    setUntilMode(stoppedStatus?.until ? "time" : "shift");
    form.reset({
      reason: stoppedStatus?.reason ?? "",
      until: stoppedStatus?.until ?? null,
    });
  }, [form, isOpen, item]);

  function handleOpenChange(open: boolean) {
    if (!open) closePanel();
  }

  const onSubmit = form.handleSubmit((payload) => {
    if (!activeItem) return;

    stopMutation.mutate(
      { id: activeItem.id, payload },
      {
        onError: (error) =>
          addToast(
            getApiErrorMessage(
              error,
              "Не удалось сохранить изменения. Попробуйте ещё раз",
            ),
          ),
      },
    );
    closePanel();
  });

  const fieldClass =
    "h-11 w-full border-2 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/35 data-[state=closed]:animate-[fade-out_180ms_ease-in] data-[state=open]:animate-[fade-in_180ms_ease-out] motion-reduce:animate-none" />
        <Dialog.Content
          aria-describedby="stop-panel-description"
          className="fixed inset-y-0 right-0 z-50 flex w-[min(30rem,100vw)] flex-col border-l-2 border-foreground bg-background shadow-2xl data-[state=closed]:animate-[drawer-out_200ms_ease-in] data-[state=open]:animate-[drawer-in_220ms_ease-out] motion-reduce:animate-none"
        >
          <header className="flex items-start justify-between gap-6 border-b-2 border-muted px-8 py-7">
            <div>
              <Dialog.Title className="font-display text-2xl font-medium uppercase">
                {mode === "edit" ? "Изменить стоп" : "Добавить в стоп-лист"}
              </Dialog.Title>
              <Dialog.Description
                id="stop-panel-description"
                className="mt-2 text-sm text-secondary"
              >
                {activeItem?.title ?? "Выбранная позиция"}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="-m-2 cursor-pointer p-2 text-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Закрыть панель"
              >
                <CloseIcon className="size-6" />
              </button>
            </Dialog.Close>
          </header>

          <form
            className="flex min-h-0 flex-1 flex-col"
            noValidate
            onSubmit={(event) => void onSubmit(event)}
          >
            <div className="flex-1 space-y-7 overflow-y-auto px-8 py-8">
              <Controller
                control={form.control}
                name="reason"
                render={({ field, fieldState }) => (
                  <fieldset
                    aria-invalid={Boolean(fieldState.error)}
                    aria-describedby={
                      fieldState.error ? "stop-reason-error" : undefined
                    }
                  >
                    <legend className="mb-3 font-sans text-base font-medium leading-none">
                      Причина стопа
                    </legend>
                    <div className="flex flex-col gap-3">
                      {reasonOptions.map(([value, label]) => (
                        <FilterTab
                          key={value}
                          active={field.value === value}
                          className="w-full min-w-0"
                          onBlur={field.onBlur}
                          onClick={() => field.onChange(value)}
                        >
                          {label}
                        </FilterTab>
                      ))}
                    </div>
                    <FieldError
                      id="stop-reason-error"
                      message={fieldState.error?.message}
                    />
                  </fieldset>
                )}
              />

              <fieldset>
                <legend className="mb-3 font-sans text-base font-medium leading-none">
                  Срок стопа
                </legend>
                <div className="flex flex-wrap gap-3">
                  <FilterTab
                    active={untilMode === "shift"}
                    onClick={() => {
                      setUntilMode("shift");
                      form.setValue("until", null, { shouldValidate: true });
                    }}
                  >
                    До конца смены
                  </FilterTab>
                  <FilterTab
                    active={untilMode === "time"}
                    onClick={() => {
                      setUntilMode("time");
                      form.setValue(
                        "until",
                        localDateTimeToIso(getNextQuarterHour()),
                        { shouldValidate: true },
                      );
                    }}
                  >
                    До времени
                  </FilterTab>
                </div>
              </fieldset>

              {untilMode === "time" && (
                <Controller
                  control={form.control}
                  name="until"
                  render={({ field, fieldState }) => (
                    <div>
                      <label
                        className="mb-2 block text-sm font-medium"
                        htmlFor="stop-until"
                      >
                        Дата и время
                      </label>
                      <input
                        id="stop-until"
                        type="datetime-local"
                        step={900}
                        className={`${fieldClass} ${fieldState.error ? "border-accent" : "border-muted"}`}
                        aria-invalid={Boolean(fieldState.error)}
                        aria-describedby={
                          fieldState.error ? "stop-until-error" : undefined
                        }
                        value={
                          field.value ? isoToLocalDateTime(field.value) : ""
                        }
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          field.onChange(localDateTimeToIso(event.target.value))
                        }
                      />
                      <FieldError
                        id="stop-until-error"
                        message={fieldState.error?.message}
                      />
                      <p className="mt-2 text-xs text-secondary">
                        Не позже чем через 24 часа, шаг — 15 минут.
                      </p>
                    </div>
                  )}
                />
              )}
            </div>

            <footer className="flex justify-end gap-3 border-t-2 border-muted px-8 py-5">
              <Dialog.Close asChild>
                <Button size="md" variant="outline">
                  Отмена
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                size="md"
                variant="accent"
                className="min-w-36"
              >
                Сохранить
              </Button>
            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-accent">
      {message}
    </p>
  );
}
