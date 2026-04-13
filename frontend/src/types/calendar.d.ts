export type CustomTimeSlotWrapperProps = {
  children?: ReactNode;
  value?: Date;
};

export type CustomGutterTimeWrapperProps = {
  children?: ReactNode;
  value?: Date; // Represents the time slot value
};

export type CustomDayColumnWrapperProps = {
  children?: ReactNode;
};

export type CustomWeekHeaderProps = {
  label: string;
  date: Date; // Ensures `date` is correctly typed
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  continuesEarlier?: boolean;
  continuesLater?: boolean;
};