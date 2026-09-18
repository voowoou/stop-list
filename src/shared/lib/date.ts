export function localDateTimeToIso(value: string): string {
  const date = new Date(value);

  // Пустое или некорректное поле должно пройти через ошибку схемы, а не стать null.
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function isoToLocalDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const localTimestamp = date.getTime() - date.getTimezoneOffset() * 60_000;
  return new Date(localTimestamp).toISOString().slice(0, 16);
}

export function getNextQuarterHour(now = new Date()): string {
  const date = new Date(now);
  date.setSeconds(0, 0);
  date.setMinutes(Math.ceil((date.getMinutes() + 1) / 15) * 15);
  return isoToLocalDateTime(date.toISOString());
}

const stopTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatStopUntil(value: string | null): string {
  if (value === null) return "До конца смены";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Срок не указан";

  return `До ${stopTimeFormatter.format(date)}`;
}
