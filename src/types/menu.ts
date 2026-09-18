export type Shop = "kitchen" | "bar" | "pastry";

export type StopReason =
  | "out_of_stock"
  | "equipment"
  | "quality"
  | "menu_change";

export type MenuItemStatus =
  | { kind: "available" }
  | {
      kind: "stopped";
      reason: StopReason;
      until: string | null;
    };

export interface MenuItem {
  id: string;
  title: string;
  shop: Shop;
  stock: number;
  status: MenuItemStatus;
  updatedAt: string;
}

export interface StopItemPayload {
  reason: StopReason;
  until: string | null;
}

export interface MenuFilters {
  readonly shop: Shop | null;
  readonly status: MenuItemStatus["kind"] | null;
}

export interface ApiSuccessResponse<TData> {
  data: TData;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    fieldErrors?: Partial<Record<keyof StopItemPayload, string[]>>;
  };
}

export type MenuItemsResponse = ApiSuccessResponse<MenuItem[]>;
export type MenuItemResponse = ApiSuccessResponse<MenuItem>;

export const shopLabels: Record<Shop, string> = {
  kitchen: "Кухня",
  bar: "Бар",
  pastry: "Кондитерская",
};

export const stopReasonLabels: Record<StopReason, string> = {
  out_of_stock: "Закончились продукты",
  equipment: "Сломалось оборудование",
  quality: "Вопросы к качеству партии",
  menu_change: "Позиция выведена из меню смены",
};

export const menuItemStatusLabels: Record<MenuItemStatus["kind"], string> = {
  available: "В продаже",
  stopped: "В стоп-листе",
};
