package com.hotel.webapp.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingRes {
  Integer id;
  Integer userId;
  String userName;
  Integer roomId;
  Integer roomNumber;
  LocalDateTime checkInTime;
  LocalDateTime checkOutTime;
  LocalDateTime actualCheckInTime;
  LocalDateTime actualCheckOutTime;
  Boolean status;
}
