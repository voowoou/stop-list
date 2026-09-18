"use client";

import { useEffect } from "react";
import {
  type ToastMessage,
  useStopListUi,
} from "@/features/stop-list/model/use-stop-list-ui";
import { CloseIcon } from "./icons/CloseIcon";

const TOAST_DURATION_MS = 5_000;

export function ToastViewport() {
  const toasts = useStopListUi((state) => state.toasts);

  return (
    <div
      aria-atomic="false"
      aria-live="polite"
      className="pointer-events-none fixed right-6 bottom-6 z-60 flex w-[min(24rem,calc(100vw-3rem))] flex-col gap-3"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: ToastMessage }) {
  const removeToast = useStopListUi((state) => state.removeToast);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => removeToast(toast.id),
      TOAST_DURATION_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [removeToast, toast.id]);

  return (
    <div className="pointer-events-auto flex items-start gap-4 border-2 border-accent bg-accent px-4 py-3 text-sm text-white shadow-xl">
      <p className="min-w-0 flex-1">{toast.message}</p>
      <button
        type="button"
        className="-m-1 cursor-pointer p-1 text-white/75 hover:text-white"
        aria-label="Закрыть уведомление"
        onClick={() => removeToast(toast.id)}
      >
        <CloseIcon className="size-5" />
      </button>
    </div>
  );
}
