"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MenuFilters } from "@/types/menu";
import { createMenuFiltersHref, readMenuFilters } from "../model/filters";
import { menuListOptions } from "../model/queries";
import { Filters } from "./Filters";
import {
  MenuListEmpty,
  MenuListError,
  MenuListLoading,
} from "./MenuListStates";
import { StopListTable } from "./StopListTable";

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
  const hasActiveFilters = filters.shop !== null || filters.status !== null;

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
        <StopListTable items={menuQuery.data} />
      )}
    </div>
  );
}
