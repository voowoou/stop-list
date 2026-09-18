import "server-only";

import type { MenuFilters, MenuItem, StopItemPayload } from "@/types/menu";

const createdAt = new Date().toISOString();

const menuItems: MenuItem[] = [
  menuItem("teftel-soup", "Суп с тефтелями", "kitchen", 8),
  menuItem("carrot-kazan", "Казан морковки", "kitchen", 12),
  menuItem("skeleton-yoghurt", "Скелетоны йогурт", "kitchen", 0, {
    reason: "out_of_stock",
    until: null,
  }),
  menuItem("psyzh-water", "Вода псыж", "kitchen", 5),
  menuItem("paracetomol-with-coffein", "Парацетомол с кофеином", "kitchen", 7),
  menuItem("okroshka", "Окрошка", "kitchen", 16),
  menuItem("cream-bun", "Булка со сливками", "pastry", 20),
  menuItem("double-apple", "Двойное яблочко", "bar", 14),
  menuItem("beepki-coctail", "Коктейль Бипки", "bar", 9, {
    reason: "equipment",
    until: null,
  }),
  menuItem("monks-soul", "Monk's Soul", "bar", 6),
  menuItem("rot-front-sweets", "Батончики Рот-фронт", "pastry", 0, {
    reason: "quality",
    until: null,
  }),
  menuItem("honey-cake", "Медовик", "pastry", 11),
  menuItem("green-tea", "Зеленый чай", "bar", 4),
  menuItem("pork-shawarma", "Шаверма со свининой", "kitchen", 7),
  menuItem("klyukalo", "Клюкало", "pastry", 3, {
    reason: "menu_change",
    until: null,
  }),
];

interface SeedStopStatus {
  reason: StopItemPayload["reason"];
  until: string | null;
}

function menuItem(
  id: string,
  title: string,
  shop: MenuItem["shop"],
  stock: number,
  stopped?: SeedStopStatus,
): MenuItem {
  return {
    id,
    title,
    shop,
    stock,
    status: stopped ? { kind: "stopped", ...stopped } : { kind: "available" },
    updatedAt: createdAt,
  };
}

function cloneMenuItem(item: MenuItem): MenuItem {
  return structuredClone(item);
}

export function getMenuItems(filters: MenuFilters): MenuItem[] {
  return menuItems
    .filter((item) => filters.shop === null || item.shop === filters.shop)
    .filter(
      (item) => filters.status === null || item.status.kind === filters.status,
    )
    .map(cloneMenuItem);
}

export function getMenuItem(id: string): MenuItem | null {
  const item = menuItems.find((candidate) => candidate.id === id);
  return item ? cloneMenuItem(item) : null;
}

export function stopMenuItem(
  id: string,
  payload: StopItemPayload,
): MenuItem | null {
  const item = menuItems.find((candidate) => candidate.id === id);
  if (!item) return null;

  item.status = { kind: "stopped", ...payload };
  item.updatedAt = new Date().toISOString();

  return cloneMenuItem(item);
}

export type ResumeMenuItemResult =
  | { kind: "success"; item: MenuItem }
  | { kind: "not_found" }
  | { kind: "zero_stock" };

export function resumeMenuItem(id: string): ResumeMenuItemResult {
  const item = menuItems.find((candidate) => candidate.id === id);
  if (!item) return { kind: "not_found" };
  if (item.stock === 0) return { kind: "zero_stock" };

  item.status = { kind: "available" };
  item.updatedAt = new Date().toISOString();

  return { kind: "success", item: cloneMenuItem(item) };
}
