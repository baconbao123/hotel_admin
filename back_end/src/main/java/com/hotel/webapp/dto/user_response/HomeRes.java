package com.hotel.webapp.dto.user_response;

import com.hotel.webapp.dto.response.LocalResponse;
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
public class HomeRes {
  List<LocalResponse> provinces;
  HotelsRes hotels;
  FilterRes filters;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class FilterRes {
    List<FacilitiesRes> facilities;
    PriceRes price;

    @Getter
    @Setter
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class PriceRes {
      BigDecimal min;
      BigDecimal max;
    }
  }

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class HotelsRes {
    List<HotelRes> content;
    Integer size;
    Long totalElement;

    @Getter
    @Setter
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class HotelRes {
      Integer id;
      String avatarUrl;
      String address;
      List<FacilitiesRes> facilities;
      BigDecimal priceNight;
    }
  }

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class FacilitiesRes {
    Integer id;
    String name;
    String icon;
  }
}


