import { Suspense } from "react";
import { normalizeMenuFilters } from "@/features/stop-list/model/filters";
import { Filters } from "@/features/stop-list/ui/Filters";
import { Header } from "@/widgets/header/ui/Header";

export default async function Home({ searchParams }: PageProps<"/">) {
  const filters = normalizeMenuFilters(await searchParams);

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-8 py-10">
        <Suspense fallback={<div className="h-24 rounded-xl bg-white/70" />}>
          <Filters initialFilters={filters} />
        </Suspense>
      </main>
    </>
  );
}
