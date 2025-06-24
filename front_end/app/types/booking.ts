
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checkedIn"
  | "checkedOut"
  | "cancelled";

export type Booking = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomId: string;
  guestName: string;
  status: BookingStatus;
  backgroundColor?: string;
  borderColor?: string;
};

export interface BookingFormData {
  guestName: string;
  roomId: string;
  startDate: Date | null;
  endDate: Date | null;
  status: BookingStatus;
}

export interface Room {
  id: string;
  roomNumber: string;
  type: string;
}
