"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMenuItemSaving } from "@/features/stop-list/model/use-is-menu-item-saving";
import { formatStopUntil } from "@/shared/lib/date";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";
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

const COMPACT_HEADER_HEIGHT = 40;
const TABLE_HEADER_HEIGHT = 56;

export function StopListTable({
  items,
  onEdit,
  onResume,
  onStop,
}: StopListTableProps) {
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const viewportScrollRef = useRef<HTMLDivElement>(null);
  const [scrollbar, setScrollbar] = useState({
    contentWidth: 0,
    headerVisible: false,
    left: 0,
    scrollLeft: 0,
    visible: false,
    width: 0,
  });

  useEffect(() => {
    const tableScroll = tableScrollRef.current;
    if (!tableScroll) return;

    let animationFrameId = 0;

    function updateScrollbar() {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(() => {
        const currentTableScroll = tableScrollRef.current;
        if (!currentTableScroll) return;

        const rect = currentTableScroll.getBoundingClientRect();
        const left = Math.max(0, rect.left);
        const right = Math.min(window.innerWidth, rect.right);

        setScrollbar({
          contentWidth: currentTableScroll.scrollWidth,
          headerVisible:
            rect.top < COMPACT_HEADER_HEIGHT &&
            rect.bottom > COMPACT_HEADER_HEIGHT + TABLE_HEADER_HEIGHT,
          left,
          scrollLeft: currentTableScroll.scrollLeft,
          visible:
            currentTableScroll.scrollWidth >
              currentTableScroll.clientWidth + 1 &&
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            right > left,
          width: Math.max(0, right - left),
        });
      });
    }

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(tableScroll);
    window.addEventListener("resize", updateScrollbar);
    window.addEventListener("scroll", updateScrollbar, { passive: true });
    updateScrollbar();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollbar);
      window.removeEventListener("scroll", updateScrollbar);
    };
  }, []);

  function syncFromTable() {
    const tableScroll = tableScrollRef.current;
    const viewportScroll = viewportScrollRef.current;
    if (tableScroll && viewportScroll) {
      viewportScroll.scrollLeft = tableScroll.scrollLeft;
      setScrollbar((current) => ({
        ...current,
        scrollLeft: tableScroll.scrollLeft,
      }));
    }
  }

  function syncFromViewport() {
    const tableScroll = tableScrollRef.current;
    const viewportScroll = viewportScrollRef.current;
    if (tableScroll && viewportScroll) {
      tableScroll.scrollLeft = viewportScroll.scrollLeft;
    }
  }

  return (
    <div>
      <div
        ref={tableScrollRef}
        className="table-scroll-content overflow-x-auto"
        onScroll={syncFromTable}
      >
        <table className="w-full min-w-300 table-fixed border-collapse text-left">
          <caption className="sr-only">
            Меню смены и управление стоп-листом
          </caption>
          <TableColGroup />
          <TableHead />
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

      <div
        aria-hidden="true"
        className={`fixed top-10 z-30 overflow-hidden bg-background ${
          scrollbar.headerVisible ? "block" : "hidden"
        }`}
        style={{ left: scrollbar.left, width: scrollbar.width }}
      >
        <table
          className="min-w-[75rem] table-fixed border-collapse text-left"
          style={{
            transform: `translateX(-${scrollbar.scrollLeft}px)`,
            width: scrollbar.contentWidth,
          }}
        >
          <TableColGroup />
          <TableHead />
        </table>
      </div>

      <div
        ref={viewportScrollRef}
        aria-hidden={!scrollbar.visible}
        className={`table-scrollbar fixed bottom-0 z-30 h-4 overflow-x-auto overflow-y-hidden bg-background ${
          scrollbar.visible ? "block" : "hidden"
        }`}
        style={{ left: scrollbar.left, width: scrollbar.width }}
        onScroll={syncFromViewport}
      >
        <div className="h-px" style={{ width: scrollbar.contentWidth }} />
      </div>
    </div>
  );
}

function TableColGroup() {
  return (
    <colgroup>
      <col className="w-[22%]" />
      <col className="w-28" />
      <col className="w-28" />
      <col className="w-40" />
      <col className="w-[30%]" />
      <col className="w-60" />
    </colgroup>
  );
}

function TableHead() {
  return (
    <thead className="bg-background">
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
  );
}

interface StopListRowProps extends Omit<StopListTableProps, "items"> {
  item: MenuItem;
}

function StopListRow({ item, onEdit, onResume, onStop }: StopListRowProps) {
  const isSaving = useIsMenuItemSaving(item.id);
  const stoppedStatus = item.status.kind === "stopped" ? item.status : null;
  const isStopped = stoppedStatus !== null;
  const resumeDisabled = item.stock === 0 || !onResume;

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
        <span className="block">{item.title}</span>
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
          {isSaving ? (
            <Button
              aria-label={`Сохраняется изменение позиции «${item.title}»`}
              className="min-w-36 gap-2 px-3"
              disabled
              variant="outline"
            >
              <Spinner />
              Сохраняем…
            </Button>
          ) : isStopped ? (
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
    <Button
      className="min-w-24 px-3"
      disabled={disabled}
      onClick={onClick}
      title={title}
      variant={accent ? "accent" : "outline"}
    >
      {children}
    </Button>
  );
}
