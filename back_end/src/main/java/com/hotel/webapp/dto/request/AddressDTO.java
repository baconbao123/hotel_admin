package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressDTO {
  @FieldNotEmpty(field = "Province")
  String provinceCode;
  @FieldNotEmpty(field = "District")
  String districtCode;
  @FieldNotEmpty(field = "Ward")
  String wardCode;
  @FieldNotEmpty(field = "Street")
  Integer streetId;
  @FieldNotEmpty(field = "Street number")
  String streetNumber;
  String note;
}


