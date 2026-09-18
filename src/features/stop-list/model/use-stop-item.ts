"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { StopItemPayload } from "@/types/menu";
import { stopMenuItem } from "../api/menu-items-api";
import {
  rollbackMenuItemOptimisticUpdate,
  updateMenuItemOptimistically,
} from "./optimistic-menu-cache";
import { menuKeys, menuMutationKeys } from "./queries";

interface StopItemVariables {
  id: string;
  payload: StopItemPayload;
}

export function useStopItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: menuMutationKeys.stop(),
    mutationFn: ({ id, payload }: StopItemVariables) =>
      stopMenuItem(id, payload),
    onMutate: ({ id, payload }) =>
      updateMenuItemOptimistically(queryClient, id, (item) => ({
        ...item,
        status: { kind: "stopped", ...payload },
        updatedAt: new Date().toISOString(),
      })),
    onError: (_error, { id }, snapshots) => {
      if (snapshots) {
        rollbackMenuItemOptimisticUpdate(queryClient, id, snapshots);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() }),
  });
}
