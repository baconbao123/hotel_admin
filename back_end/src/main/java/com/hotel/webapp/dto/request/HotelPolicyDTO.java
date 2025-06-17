package com.hotel.webapp.dto.request;

import jakarta.annotation.Nullable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelPolicyDTO {
  String name;
  @Nullable
  Integer hotelId = null;
  String description;
}
