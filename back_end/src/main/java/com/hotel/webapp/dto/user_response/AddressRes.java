package com.hotel.webapp.dto.user_response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressRes {
  String number;
  String street;
  String province;
  String district;
  String ward;
  String note;
}
