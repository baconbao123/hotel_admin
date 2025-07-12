package com.hotel.webapp.dto.user_response;

import com.hotel.webapp.entity.RoomImages;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class  RoomUserRes {
  RoomRes room;
  List<TypeRes> types;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class RoomRes {
    Integer id;
    String name;
    String address;
    String description;
    BigDecimal roomArea;
    BigDecimal priceHours;
    BigDecimal priceNight;
    String type;
    String avatar;
    Integer limitPerson;

    List<HomeRes.FacilitiesRes> facilities;
    List<RoomImages> images;
    Policy policy;

    @Getter
    @Setter
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Policy {
      Integer id;
      String name;
      String description;
    }
  }

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class TypeRes {
    String name;
    List<RoomsRes> rooms;

    @Getter
    @Setter
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RoomsRes {
      Integer id;
      String name;
      String avatarRoom;
      String description;
      List<HomeRes.FacilitiesRes> facilities;
      BigDecimal area;
      Integer roomNumber;
      BigDecimal priceNight;
      BigDecimal priceHours;
      String type;
      Integer limit;
    }
  }
}