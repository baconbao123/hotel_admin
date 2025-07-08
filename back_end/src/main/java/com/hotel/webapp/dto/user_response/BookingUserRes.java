package com.hotel.webapp.dto.user_response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingUserRes {
  RoomInfo roomInfo;
  List<BookedTime> booked;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class RoomInfo {
    Integer roomId;
    String roomName;
    BigDecimal priceHours;
    BigDecimal priceNights;
  }

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class BookedTime {
    LocalDateTime checkInTime;
    LocalDateTime checkOutTime;
  }
}
