"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getApiErrorMessage } from "@/shared/api/api-error";
import { ToastViewport } from "@/shared/ui/ToastViewport";
import type { MenuFilters } from "@/types/menu";
import { createMenuFiltersHref, readMenuFilters } from "../model/filters";
import { menuListOptions } from "../model/queries";
import { useResumeItem } from "../model/use-resume-item";
import { useStopListUi } from "../model/use-stop-list-ui";
import { Filters } from "./Filters";
import {
  MenuListEmpty,
  MenuListError,
  MenuListLoading,
} from "./MenuListStates";
import { StopListTable } from "./StopListTable";
import { StopReasonPanel } from "./StopReasonPanel";

interface StopListProps {
  initialFilters: MenuFilters;
}

export function StopList({ initialFilters }: StopListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlFilters = readMenuFilters(searchParams);
  const filters = searchParams.size === 0 ? initialFilters : urlFilters;
  const menuQuery = useQuery(menuListOptions(filters));
  const resumeMutation = useResumeItem();
  const hasActiveFilters = filters.shop !== null || filters.status !== null;
  const selectedItemId = useStopListUi((state) => state.selectedItemId);
  const openPanel = useStopListUi((state) => state.openPanel);
  const addToast = useStopListUi((state) => state.addToast);
  const selectedItem =
    menuQuery.data?.find((item) => item.id === selectedItemId) ?? null;

  function resetFilters() {
    router.push(
      createMenuFiltersHref(
        pathname,
        new URLSearchParams(searchParams.toString()),
        { shop: null, status: null },
      ),
      { scroll: false },
    );
  }

  function resumeItem(id: string) {
    resumeMutation.mutate(
      { id },
      {
        onError: (error) =>
          addToast(
            getApiErrorMessage(
              error,
              "Не удалось вернуть позицию в продажу. Попробуйте ещё раз",
            ),
          ),
      },
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Filters initialFilters={initialFilters} />

      {menuQuery.isPending ? (
        <MenuListLoading />
      ) : menuQuery.isError ? (
        <MenuListError
          message={menuQuery.error.message}
          isRetrying={menuQuery.isFetching}
          onRetry={() => void menuQuery.refetch()}
        />
      ) : menuQuery.data.length === 0 ? (
        <MenuListEmpty
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />
      ) : (
        <StopListTable
          items={menuQuery.data}
          onEdit={(item) => openPanel(item.id, "edit")}
          onResume={(item) => resumeItem(item.id)}
          onStop={(item) => openPanel(item.id, "create")}
        />
      )}

      <StopReasonPanel item={selectedItem} />
      <ToastViewport />
    </div>
  );
}
