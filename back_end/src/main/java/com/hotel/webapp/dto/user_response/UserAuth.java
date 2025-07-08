package com.hotel.webapp.dto.user_response;

import com.hotel.webapp.validation.FieldAndCheckRegexp;
import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.ForceType;
import com.hotel.webapp.validation.Trim;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAuth {
  @FieldAndCheckRegexp(field = "Email", notice = "Enter a valid email (example: a@gmail.com)",
        force = ForceType.MANDATORY, regex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
  @Trim
  String email;
  @FieldNotEmpty(field = "Password")
  String password;
  @NotNull
  Boolean remember = false;

  @Getter
  @Setter
  @AllArgsConstructor
  @NoArgsConstructor
  @FieldDefaults(level = AccessLevel.PRIVATE)
  public static class UserRegister {
    @FieldAndCheckRegexp(field = "Email", notice = "Enter a valid email (example: a@gmail.com)",
          force = ForceType.MANDATORY, regex = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
    @Trim
    String email;
    @FieldAndCheckRegexp(field = "Password", notice = "At least 8 characters, with upper & lower case, number, and symbol.",
          force = ForceType.MANDATORY, regex = "^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$")
    String password;
    @FieldNotEmpty(field = "fullname")
    String fullName;
    @FieldAndCheckRegexp(field = "Phone Number", notice = "Phone number must be exactly 10 digits",
          force = ForceType.MANDATORY, regex = "^(\\(\\d{3}\\)|\\d{3})-?\\d{3}-?\\d{4}$")
    @Trim
    String phoneNumber;
    MultipartFile avatar;
  }
}
