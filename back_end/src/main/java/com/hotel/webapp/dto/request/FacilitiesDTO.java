package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.Trim;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FacilitiesDTO {
  @Trim
  @FieldNotEmpty(field = "name")
  String name;
  @FieldNotEmpty(field = "type")
  String colName;
  @FieldNotEmpty(field = "number")
  Integer number;
}
