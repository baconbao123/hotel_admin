package com.hotel.webapp.dto.user_response;

import com.hotel.webapp.entity.HotelImages;
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
public class HotelUserRes {
  HotelRes hotel;
  List<RoomRes> rooms;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class HotelRes {
    Integer id;
    String name;
    String address;
    String description;
    String avatar;
    List<HomeRes.FacilitiesRes> facilities; //
    List<HotelImages> images; //
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
  public static class RoomRes {
    Integer id;
    String name;
    String avatar;
    List<HomeRes.FacilitiesRes> facilities; //
    BigDecimal area;
    BigDecimal priceNight;
    BigDecimal priceHours;
    String type;
  }
}
