package com.hotel.webapp.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDTO {
  Integer userId;
  Integer roomId;
  LocalDateTime checkInTime;
  LocalDateTime checkOutTime;
  LocalDateTime actualCheckInTime;
  LocalDateTime actualCheckOutTime;
  String note;
  Boolean status;
}
