"use client";

import { create } from "zustand";

export type StopPanelMode = "create" | "edit";

export interface ToastMessage {
  id: number;
  message: string;
}

interface StopListUiState {
  isPanelOpen: boolean;
  panelMode: StopPanelMode | null;
  selectedItemId: string | null;
  toasts: ToastMessage[];
  openPanel: (itemId: string, mode: StopPanelMode) => void;
  closePanel: () => void;
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
}

let nextToastId = 0;

export const useStopListUi = create<StopListUiState>((set) => ({
  isPanelOpen: false,
  panelMode: null,
  selectedItemId: null,
  toasts: [],
  openPanel: (selectedItemId, panelMode) =>
    set({ isPanelOpen: true, panelMode, selectedItemId }),
  closePanel: () => set({ isPanelOpen: false }),
  addToast: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: ++nextToastId, message }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
