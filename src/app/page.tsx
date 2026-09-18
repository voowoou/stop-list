import { Suspense } from "react";
import { normalizeMenuFilters } from "@/features/stop-list/model/filters";
import { StopList } from "@/features/stop-list/ui/StopList";
import { Header } from "@/widgets/header/ui/Header";

export default async function Home({ searchParams }: PageProps<"/">) {
  const filters = normalizeMenuFilters(await searchParams);

  return (
    <>
      <Header />
      <main className="flex w-full flex-1 flex-col gap-8 px-8 py-10">
        <Suspense fallback={<div className="h-24 bg-white/70" />}>
          <StopList initialFilters={filters} />
        </Suspense>
      </main>
    </>
  );
}
