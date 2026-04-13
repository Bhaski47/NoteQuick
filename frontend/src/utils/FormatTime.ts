import {
  CalendarDate,
  CalendarDateTime,
  getLocalTimeZone,
  now,
  parseDateTime,
} from "@internationalized/date";

const nowTime = now(getLocalTimeZone());
export function toNoonISO(
  date: CalendarDate | CalendarDateTime | string | undefined,
): string | undefined {
  if (!date) return undefined;
  if (typeof date === "string") {
    return date.includes("T")
      ? date
      : `${date}T${String(nowTime.hour).padStart(2, "0")}:${String(nowTime.minute).padStart(2, "0")}:00`;
  }
  const y = date.year;
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  const isDateTime = "hour" in date;
  const h = isDateTime
    ? String((date as CalendarDateTime).hour).padStart(2, "0")
    : String(nowTime.hour).padStart(2, "0");
  const min = isDateTime
    ? String((date as CalendarDateTime).minute).padStart(2, "0")
    : String(nowTime.minute).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:00`;
}

export function toCalendarDateTimeValue(
  value: string | undefined,
): CalendarDateTime | undefined {
  if (!value) return undefined;
  try {
    const withTime = value.includes("T") ? value : `${value}T12:00:00`;
    return parseDateTime(withTime);
  } catch {
    return undefined;
  }
}
