package com.hotel.webapp.dto.response.owner;

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
public class RoomRes {
  Integer id;
  String name;
  String roomAvatar;
  String hotelName;
  BigDecimal roomArea;
  Integer roomNumber;
  String roomType;
  BigDecimal priceHours;
  BigDecimal priceNight;
  Integer limitPerson;
  String description;
  Boolean status;
  String createdName;
  String updatedName;
  LocalDateTime createdAt;
  LocalDateTime updatedAt;

  List<RoomFacilities> roomFacilities;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class RoomFacilities {
    Integer id;
    String name;
  }
}
