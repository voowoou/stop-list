export function localDateTimeToIso(value: string): string {
  const date = new Date(value);

  // Пустое или некорректное поле должно пройти через ошибку схемы, а не стать null.
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}
