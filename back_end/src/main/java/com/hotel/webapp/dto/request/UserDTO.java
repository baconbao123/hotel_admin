package com.hotel.webapp.dto.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.Trim;
import jakarta.validation.constraints.Email;
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
  @Email(message = "EMAIL_INVALID", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
  @Trim
  @FieldNotEmpty(field = "Otp")
  String email;
  //  @Pattern(regexp = "^\\d{10}$")
  @Trim
  @FieldNotEmpty(field = "Phone number")
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
    @Email(message = "EMAIL_INVALID", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    @Trim
    @FieldNotEmpty(field = "Otp")
    String email;
    @Trim
    @FieldNotEmpty(field = "Phone number")
    String phoneNumber;
    String password;

    MultipartFile avatarUrl;
    String keepAvatar;
  }
}


