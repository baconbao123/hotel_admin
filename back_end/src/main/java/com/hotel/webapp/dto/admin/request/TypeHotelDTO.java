package com.hotel.webapp.dto.admin.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TypeHotelDTO {
  @FieldNotEmpty(field = "Name")
  String name;
}
