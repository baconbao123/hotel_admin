package com.hotel.webapp.dto.admin.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import jakarta.annotation.Nullable;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreetDTO {
  @FieldNotEmpty(field = "name")
  String name;
  @FieldNotEmpty(field = "District code")
  String districtCode;
  @Nullable
  BigDecimal width;
  @Nullable
  BigDecimal curbWith;
}
