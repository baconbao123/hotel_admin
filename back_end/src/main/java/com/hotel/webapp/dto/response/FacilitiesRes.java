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
public class FacilitiesRes {
  Integer id;
  String name;
  String icon;
  String typeName;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class FacilityRes {
    Integer id;
    String name;
    String icon;
    Integer type;
    String typeName;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String createdName;
    String updatedName;
  }
}
