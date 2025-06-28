package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldAndCheckRegexp;
import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.ForceType;
import com.hotel.webapp.validation.Trim;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {
  @Trim
  @FieldNotEmpty(field = "Full name")
  String fullName;
  @FieldAndCheckRegexp(field = "Email", force = ForceType.MANDATORY, regex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
  @Trim
  String email;
  @FieldAndCheckRegexp(field = "Phone Number", force = ForceType.MANDATORY, regex = "^(\\(\\d{3}\\)|\\d{3})-?\\d{3}-?\\d{4}$")
  @Trim
  String phoneNumber;
  String password;

  MultipartFile avatarUrl;
  String keepAvatar;

  @FieldNotEmpty(field = "Status")
  Boolean status;

  // roles
  List<Integer> rolesIds;

  @Getter
  @Setter
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public class ProfileDTO {
    @Trim
    @FieldNotEmpty(field = "Full name")
    String fullName;
    @FieldAndCheckRegexp(field = "Email", force = ForceType.MANDATORY, regex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    @Trim
    String email;
    @FieldAndCheckRegexp(field = "Phone Number", force = ForceType.MANDATORY, regex = "^(\\(\\d{3}\\)|\\d{3})-?\\d{3}-?\\d{4}$")
    @Trim
    String phoneNumber;
    MultipartFile avatarUrl;
    String keepAvatar;
  }
}


