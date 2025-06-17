package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApproveHotelDTO {
  @FieldNotEmpty(field = "hotel id")
  Integer hotelId;
  @FieldNotEmpty(field = "approve id")
  Integer approveId;
  @FieldNotEmpty(field = "reason")
  String reason;
  Boolean approved;
}
