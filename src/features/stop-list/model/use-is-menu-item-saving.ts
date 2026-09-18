"use client";

import { useIsMutating } from "@tanstack/react-query";
import { menuMutationKeys } from "./queries";

export function useIsMenuItemSaving(id: string): boolean {
  return (
    useIsMutating({
      mutationKey: menuMutationKeys.all,
      predicate: (mutation) =>
        getMutationItemId(mutation.state.variables) === id,
    }) > 0
  );
}

function getMutationItemId(variables: unknown): string | null {
  if (typeof variables !== "object" || variables === null) return null;
  if (!("id" in variables) || typeof variables.id !== "string") return null;
  return variables.id;
}
