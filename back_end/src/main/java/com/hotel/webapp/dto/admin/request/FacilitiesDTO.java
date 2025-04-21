package com.hotel.webapp.dto.admin.request;

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
  Integer typeId;
  @FieldNotEmpty(field = "number")
  Integer number;
}
