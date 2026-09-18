import { Spinner } from "@/shared/ui/Spinner";

const columns = [
  { id: "title", width: "w-48" },
  { id: "shop", width: "w-28" },
  { id: "stock", width: "w-20" },
  { id: "status", width: "w-28" },
  { id: "reason", width: "w-48" },
  { id: "actions", width: "w-32" },
] as const;

export function MenuListLoading() {
  return (
    <div aria-busy="true" className="overflow-hidden border-y-2 border-muted">
      <span className="sr-only">Загрузка меню</span>
      <div className="min-w-5xl">
        {[0, 1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="flex min-h-20 items-center justify-between gap-8 border-b border-muted px-4 last:border-b-0"
          >
            {columns.map(({ id, width }) => (
              <span
                key={`${row}-${id}`}
                className={`h-4 animate-pulse bg-muted/70 motion-reduce:animate-none ${width}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface MenuListErrorProps {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}

export function MenuListError({
  message,
  isRetrying,
  onRetry,
}: MenuListErrorProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 border-y-2 border-muted px-6 text-center">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-medium">
          Не удалось загрузить меню
        </h2>
        <p className="text-sm text-secondary">{message}</p>
      </div>
      <button
        type="button"
        className="inline-flex h-8 cursor-pointer items-center gap-2 border-2 border-foreground px-4 font-display text-base font-medium leading-none uppercase disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {isRetrying && <Spinner />}
        {isRetrying ? "Повторяем" : "Попробовать снова"}
      </button>
    </div>
  );
}

interface MenuListEmptyProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function MenuListEmpty({
  hasActiveFilters,
  onResetFilters,
}: MenuListEmptyProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 border-y-2 border-muted px-6 text-center">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-medium">
          {hasActiveFilters ? "Ничего не найдено" : "Меню пока пусто"}
        </h2>
        <p className="text-sm text-secondary">
          {hasActiveFilters
            ? "Попробуйте изменить или сбросить выбранные фильтры."
            : "Позиции появятся здесь после добавления в меню смены."}
        </p>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          className="h-8 cursor-pointer border-2 border-foreground px-4 font-display text-base font-medium leading-none uppercase"
          onClick={onResetFilters}
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
