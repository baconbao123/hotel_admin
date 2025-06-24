import type { BookingStatus } from "./booking";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    guestName: string;
    roomId: string;
    status: string;
  };
}

export interface BusinessCalendarProps {
  events?: CalendarEvent[];
  createDialogContent?: React.ReactNode;
  viewDialogContent?: React.ReactNode;
  editDialogContent?: React.ReactNode;
  onEventCreate: (data: CalendarEvent) => Promise<void>;
  onEventUpdate?: (event: CalendarEvent) => Promise<void>;
  onEventDelete?: (eventId: string) => Promise<void>;
  allowedViews?: ("dayGridMonth" | "timeGridWeek" | "timeGridDay")[];
  validateDateSelection?: (start: Date, end: Date) => boolean | string;
  eventColors?: Record<string, string>;
  businessHours?: {
    startTime: string;
    endTime: string;
    daysOfWeek?: number[];
  };
}
