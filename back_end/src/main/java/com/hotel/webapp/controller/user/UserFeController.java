package com.hotel.webapp.controller.user;

import com.hotel.webapp.dto.response.ApiResponse;
import com.hotel.webapp.dto.response.UserRes;
import com.hotel.webapp.dto.user_response.UserAuth;
import com.hotel.webapp.service.admin.UserService;
import com.hotel.webapp.service.admin.interfaces.AuthService;
import com.hotel.webapp.service.system.EmailService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user-profile")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserFeController {
  UserService userService;
  AuthService authService;
  EmailService emailService;

  @GetMapping
  public ApiResponse<UserRes.UserFEProfileRes> findProfileLogin() {
    return ApiResponse.<UserRes.UserFEProfileRes>builder()
                      .result(userService.findUserProfile())
                      .build();
  }

  @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<UserRes.UserFEProfileRes> updateProfileUser(@Valid @ModelAttribute
  UserAuth.UserUpdateProfile userUpdateProfile) {
    return ApiResponse.<UserRes.UserFEProfileRes>builder()
                      .result(userService.updateUserProfile(userUpdateProfile))
                      .build();
  }

  @PostMapping("/change-password-profile")
  public ApiResponse<Object> changeProfilePassword(@RequestParam String email,
        @RequestParam("oldPassword") String oldPassword) {
    if (!userService.matchPassword(email, oldPassword)) {
      return ApiResponse.builder()
                        .code(404)
                        .message("Password don't match")
                        .build();
    }

    String token = authService.generatePasswordResetToken(email);

    String subject = "Reset Password";
    String text = "http://localhost:5173/reset-password-profile?token=" + token;
    emailService.sendEmail(email, subject, text);

    return ApiResponse.builder()
                      .message("Reset password has been sent to your email")
                      .build();

  }

  @PostMapping("/reset-password-profile")
  public ApiResponse<Object> resetPassword(@RequestParam("token") String token,
        @RequestParam("newPassword") String newPassword) throws ParseException, JOSEException {

    authService.resetPassword(token, newPassword);

    return ApiResponse.builder()
                      .message("Successfully reset your password")
                      .build();

  }
}
