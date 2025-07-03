package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreetsDTO {
  @FieldNotEmpty(field = "name")
  String name;
  @FieldNotEmpty(field = "ward")
  String wardCode;
  BigDecimal width;
  BigDecimal curbWith;
}
