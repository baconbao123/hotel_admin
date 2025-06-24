import type { Booking, Room, BookingStatus } from "@/types/booking";

export const mockBookings: Booking[] = [
  {
    id: "1",
    title: "Room 101 - John Doe",
    start: new Date(2024, 0, 15),
    end: new Date(2024, 0, 18),
    roomId: "1",
    guestName: "John Doe",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Room 202 - Jane Smith",
    start: new Date(2024, 0, 20),
    end: new Date(2024, 0, 22),
    roomId: "4",
    guestName: "Jane Smith",
    status: "pending",
  },
] as const;

export const mockRooms: Room[] = [
  { id: "1", roomNumber: "101", type: "Standard" },
  { id: "2", roomNumber: "102", type: "Standard" },
  { id: "3", roomNumber: "201", type: "Deluxe" },
  { id: "4", roomNumber: "202", type: "Deluxe" },
  { id: "5", roomNumber: "301", type: "Suite" },
];

// Mock API service with proper typing
export const mockApiService = {
  getBookings: (): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBookings), 500);
    });
  },

  getRooms: (): Promise<Room[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRooms), 500);
    });
  },

  createBooking: (booking: Omit<Booking, "id">): Promise<Booking> => {
    return new Promise((resolve) => {
      const newBooking: Booking = {
        ...booking,
        id: Math.random().toString(36).substr(2, 9),
      };
      setTimeout(() => resolve(newBooking), 500);
    });
  },

  updateBooking: (booking: Booking): Promise<Booking> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(booking), 500);
    });
  },

  deleteBooking: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },
};
