import { CalendarDate } from "@internationalized/date";

export const formatDate = (date: CalendarDate) => {
  if (!date) return null;
  const { year, month, day } = date;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

export const formatDateTime = (dateTime: moment.Moment) => {
  console.log(dateTime?.format('YYYY-MM-DDTHH:mm'));
  
  return dateTime?.format('YYYY-MM-DDTHH:mm') ?? null;
};