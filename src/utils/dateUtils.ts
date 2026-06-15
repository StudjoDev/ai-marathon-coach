const WEEKDAY_LABELS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

export function toDateOnly(value: string | Date) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayInputValue() {
  return new Date().toLocaleDateString("en-CA");
}

export function formatMonthDay(date: string | Date) {
  const value = toDateOnly(date);
  return `${value.getMonth() + 1}/${value.getDate()}`;
}

export function formatWeekday(date: string | Date) {
  return WEEKDAY_LABELS[toDateOnly(date).getDay()];
}

export function formatChineseDate(date: string | Date) {
  return `${formatMonthDay(date)} ${formatWeekday(date)}`;
}

export function isDateInRange(date: string, start: string, end: string) {
  const current = toDateOnly(date).getTime();
  return current >= toDateOnly(start).getTime() && current <= toDateOnly(end).getTime();
}
