package com.hotel.webapp.dto.admin.request;

import com.hotel.webapp.validation.FieldNotEmpty;
import com.hotel.webapp.validation.Trim;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthReq {
  @Email(message = "EMAIL_INVALID", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
  @Trim
  String email;
  @FieldNotEmpty(field = "Password")
  String password;
  @NotNull
  Boolean remember = false;
}
