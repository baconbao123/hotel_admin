package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import jakarta.annotation.Nullable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelDTO {
  @FieldNotEmpty(field = "Owner")
  Integer ownerId;
  @FieldNotEmpty(field = "Name")
  String name;
  @Nullable
  String description;
  Integer avatarId;
  @FieldNotEmpty(field = "Address")
  Integer addressId;
  Boolean status;
  @FieldNotEmpty(field = "Policy")
  Integer policyId;
}
