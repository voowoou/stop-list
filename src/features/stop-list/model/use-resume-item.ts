"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeMenuItem } from "../api/menu-items-api";
import {
  rollbackMenuItemOptimisticUpdate,
  updateMenuItemOptimistically,
} from "./optimistic-menu-cache";
import { menuKeys, menuMutationKeys } from "./queries";

interface ResumeItemVariables {
  id: string;
}

export function useResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: menuMutationKeys.resume(),
    mutationFn: ({ id }: ResumeItemVariables) => resumeMenuItem(id),
    onMutate: ({ id }) =>
      updateMenuItemOptimistically(queryClient, id, (item) => ({
        ...item,
        status: { kind: "available" },
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
