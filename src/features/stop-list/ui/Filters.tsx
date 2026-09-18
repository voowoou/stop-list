"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterTab } from "@/shared/ui/FilterTab";
import type { MenuFilters } from "@/types/menu";
import { createMenuFiltersHref, readMenuFilters } from "../model/filters";

interface FiltersProps {
  initialFilters: ReturnType<typeof readMenuFilters>;
}

export function Filters({ initialFilters }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlFilters = readMenuFilters(searchParams);
  const filters = searchParams.size === 0 ? initialFilters : urlFilters;

  function navigate(nextFilters: typeof filters) {
    const href = createMenuFiltersHref(
      pathname,
      new URLSearchParams(searchParams.toString()),
      nextFilters,
    );

    router.push(href, { scroll: false });
  }

  function selectShop(shop: MenuFilters["shop"]) {
    navigate({ ...filters, shop });
  }

  function selectStatus(status: MenuFilters["status"]) {
    navigate({ ...filters, status });
  }

  return (
    <section
      aria-label="Фильтры меню"
      className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:flex-nowrap"
    >
      <fieldset className="w-full lg:w-auto">
        <legend className="sr-only">Цех</legend>
        <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
          <span
            aria-hidden="true"
            className="shrink-0 font-sans text-base font-medium leading-none"
          >
            Цех
          </span>
          <div className="flex flex-wrap gap-3">
            <FilterTab
              active={filters.shop === null}
              onClick={() => selectShop(null)}
            >
              Все
            </FilterTab>
            <FilterTab
              active={filters.shop === "kitchen"}
              onClick={() => selectShop("kitchen")}
            >
              Кухня
            </FilterTab>
            <FilterTab
              active={filters.shop === "bar"}
              onClick={() => selectShop("bar")}
            >
              Бар
            </FilterTab>
            <FilterTab
              active={filters.shop === "pastry"}
              onClick={() => selectShop("pastry")}
            >
              Кондитерская
            </FilterTab>
          </div>
        </div>
      </fieldset>

      <fieldset className="w-full lg:w-auto">
        <legend className="sr-only">Статус</legend>
        <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
          <span
            aria-hidden="true"
            className="shrink-0 font-sans text-base font-medium leading-none"
          >
            Статус
          </span>
          <div className="flex flex-wrap gap-3">
            <FilterTab
              active={filters.status === null}
              onClick={() => selectStatus(null)}
            >
              Все
            </FilterTab>
            <FilterTab
              active={filters.status === "available"}
              onClick={() => selectStatus("available")}
            >
              В продаже
            </FilterTab>
            <FilterTab
              active={filters.status === "stopped"}
              onClick={() => selectStatus("stopped")}
            >
              Стоп-лист
            </FilterTab>
          </div>
        </div>
      </fieldset>
    </section>
  );
}
