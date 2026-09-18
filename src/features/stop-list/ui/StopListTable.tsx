"use client";

import { useIsMenuItemSaving } from "@/features/stop-list/model/use-is-menu-item-saving";
import { formatStopUntil } from "@/shared/lib/date";
import { Badge } from "@/shared/ui/Badge";
import {
  type MenuItem,
  menuItemStatusLabels,
  shopLabels,
  stopReasonLabels,
} from "@/types/menu";

interface StopListTableProps {
  items: MenuItem[];
  onEdit?: (item: MenuItem) => void;
  onResume?: (item: MenuItem) => void;
  onStop?: (item: MenuItem) => void;
}

export function StopListTable({
  items,
  onEdit,
  onResume,
  onStop,
}: StopListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-6xl table-fixed border-collapse text-left">
        <caption className="sr-only">
          Меню смены и управление стоп-листом
        </caption>
        <colgroup>
          <col className="w-1/4" />
          <col className="w-1/12" />
          <col className="w-1/12" />
          <col className="w-1/8" />
          <col className="w-7/24" />
          <col className="w-1/6" />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-muted text-base font-medium text-secondary">
            <th className="px-4 py-4 text-left font-medium">Наименование</th>
            <th className="px-4 py-4 text-left font-medium">Цех</th>
            <th className="px-4 py-4 text-right font-medium">Остаток</th>
            <th className="px-4 py-4 text-left font-medium">Статус</th>
            <th className="px-4 py-4 text-left font-medium">
              Причина и срок стопа
            </th>
            <th className="px-4 py-4 text-right font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <StopListRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onResume={onResume}
              onStop={onStop}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StopListRowProps extends Omit<StopListTableProps, "items"> {
  item: MenuItem;
}

function StopListRow({ item, onEdit, onResume, onStop }: StopListRowProps) {
  const isSaving = useIsMenuItemSaving(item.id);
  const stoppedStatus = item.status.kind === "stopped" ? item.status : null;
  const isStopped = stoppedStatus !== null;
  const resumeDisabled = isSaving || item.stock === 0 || !onResume;

  return (
    <tr
      className={`border-b border-muted transition-colors last:border-b-2 ${
        isStopped ? "bg-black/3 text-secondary" : "hover:bg-white/40"
      }`}
    >
      <th
        scope="row"
        className="align-top px-4 py-5 font-sans font-medium text-foreground"
      >
        <span className="block max-w-64">{item.title}</span>
        {isSaving && (
          <output className="mt-1 block text-xs font-medium text-accent">
            Сохраняется…
          </output>
        )}
      </th>
      <td className="align-top px-4 py-5">{shopLabels[item.shop]}</td>
      <td className="align-top px-4 py-5 text-right tabular-nums">
        {item.stock}
      </td>
      <td className="align-top px-4 py-5 text-left">
        <Badge tone={isStopped ? "muted" : "success"}>
          {menuItemStatusLabels[item.status.kind]}
        </Badge>
      </td>
      <td className="align-top px-4 py-5">
        {stoppedStatus ? (
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              {stopReasonLabels[stoppedStatus.reason]}
            </p>
            <p className="text-sm">{formatStopUntil(stoppedStatus.until)}</p>
          </div>
        ) : (
          <span>
            <span className="sr-only">Причина отсутствует</span>
            <span aria-hidden="true">-</span>
          </span>
        )}
      </td>
      <td className="align-top px-4 py-5">
        <div className="flex justify-end gap-2">
          {isStopped ? (
            <>
              <ActionButton
                disabled={isSaving || !onEdit}
                onClick={() => onEdit?.(item)}
              >
                Изменить
              </ActionButton>
              <ActionButton
                disabled={resumeDisabled}
                title={
                  item.stock === 0
                    ? "Нельзя вернуть в продажу: остаток равен нулю"
                    : undefined
                }
                onClick={() => onResume?.(item)}
              >
                В продажу
              </ActionButton>
            </>
          ) : (
            <ActionButton
              accent
              disabled={isSaving || !onStop}
              onClick={() => onStop?.(item)}
            >
              В стоп-лист
            </ActionButton>
          )}
        </div>
      </td>
    </tr>
  );
}

interface ActionButtonProps {
  accent?: boolean;
  children: string;
  disabled: boolean;
  onClick: () => void;
  title?: string;
}

function ActionButton({
  accent = false,
  children,
  disabled,
  onClick,
  title,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`h-8 min-w-24 cursor-pointer whitespace-nowrap border-2 px-3 font-display text-sm font-medium leading-none uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
        accent
          ? "border-accent bg-accent text-white hover:bg-accent/90"
          : "border-foreground text-foreground hover:bg-foreground/10"
      }`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
