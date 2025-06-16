package com.hotel.webapp.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRes {
  Integer id;
  String fullName;
  String email;
  String phoneNumber;
  String avatarUrl;
  Boolean status;

  String streetNumber;
  Integer streetId;
  String wardCode;
  String districtCode;
  String provinceCode;
  String note;

  List<RoleRes> roles;

  @Getter
  @Setter
  @AllArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class RoleRes {
    Integer roleId;
    String roleName;
  }
}
